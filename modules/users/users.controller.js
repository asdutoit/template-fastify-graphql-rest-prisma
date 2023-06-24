import {
  createUser,
  getUsers,
  deleteuser,
  login,
  verifyPassword,
} from "./users.service.js";

export async function registerUser(request, reply) {
  const { prisma, jwt } = request;
  const user = await createUser({ ...request.body }, prisma);
  const token = await jwt.sign(
    { email: user.email, role: user.role },
    { expiresIn: 3 * 86400 }
  );
  reply.send({ token, id: user.id, email: user.email });
}

export async function loginUser(request, reply) {
  const { prisma, jwt, cache } = request;
  const cachedUser = await cache.get(request.body.email);
  if (cachedUser) {
    const valid = await verifyPassword(
      request.body.password,
      cachedUser.item.password
    );
    if (!valid) {
      reply
        .status(401)
        .send({ Error: "User does not exist or Password is incorrect" });
    } else {
      const token = await jwt.sign(
        { email: cachedUser.item.email, role: cachedUser.item.role },
        { expiresIn: 3 * 86400 }
      );
      return reply.send({
        cache: "Hit",
        token,
        email: cachedUser.item.email,
        id: cachedUser.item.id,
        role: cachedUser.item.role,
      });
    }
  } else {
    const user = await login({ ...request.body }, prisma);
    if (!user) {
      reply
        .status(401)
        .send({ Error: "User does not exist or Password is incorrect" });
    } else {
      const token = await jwt.sign(
        { email: user.email, role: user.role },
        { expiresIn: 3 * 86400 }
      );
      await cache.set(request.body.email, { ...user }, 100000);
      reply.send({
        cache: "Miss",
        token,
        email: user.email,
        id: user.id,
        role: user.role,
      });
    }
  }
}

export async function getAllUsers(request, reply) {
  const { prisma, query, cache, user } = request;
  if (user.role !== "ADMIN") {
    reply.status(401).send({ Error: "Unauthorized ROLE" });
  }
  const cachedUsers = await cache.get("allusers");
  if (cachedUsers) {
    return reply.send({ cache: "Hit", ...cachedUsers.item });
  } else {
    const users = await getUsers(prisma);
    await cache.set("allusers", { users }, 100000);
    reply.send({ cache: "Miss", users });
  }
}

export async function deleteUser(request, reply) {
  const { prisma } = request;
  const user = await deleteuser({ ...request.body }, prisma);
  reply.status(201).send({ message: "User Deleted Successfully" });
}
