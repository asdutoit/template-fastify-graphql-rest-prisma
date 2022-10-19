import { createUser, getUsers } from "./users.service.js";

export async function registerUser(request, reply) {
  const { prisma, jwt } = request;
  const user = await createUser({ ...request.body }, prisma);
  const token = await jwt.sign(user);
  reply.send({ token });
}

export async function getAllUsers(request, reply) {
  const { prisma } = request;
  const users = await getUsers(prisma);
  reply.send({ users });
}
