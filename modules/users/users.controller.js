import { createUser, getUsers, deleteuser } from "./users.service.js";

export async function registerUser(request, reply) {
  const { prisma, jwt } = request;
  const user = await createUser({ ...request.body }, prisma);
  const token = await jwt.sign(user);
  reply.send({ token, id: user.id, email: user.email });
}

export async function loginUser(request, reply) {
  const { prisma, jwt } = request;
  const user = await getUsers({ ...request.body }, prisma);
  const token = await jwt.sign(user);
  reply.send({ token, id: user.id, email: user.email });
}

export async function getAllUsers(request, reply) {
  const { prisma, query, cache } = request;
  const cachedUsers = await cache.get("allusers");
  if (cachedUsers) {
    console.log("Users: Cache Returned");
    return reply.send(cachedUsers.item)
  } else {
    console.log("Users: DB Returned");
    const users = await getUsers(prisma);
    await cache.set("allusers", { users }, 100000)
    reply.send({ users });
  }
}

export async function deleteUser(request, reply) {
  const { prisma } = request;
  const user = await deleteuser({ ...request.body }, prisma);
  reply.send("Ssdfsdf");
}
