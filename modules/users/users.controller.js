import { createUser, getUsers } from "./users.service.js";

export async function registerUser(request, reply) {
  const { prisma } = request.fastify;
  const user = await createUser({ ...request.body }, prisma);
  reply.send({ user });
}

export async function getAllUsers(request, reply) {
  const { prisma } = request.fastify;
  const users = await getUsers(prisma);
  reply.send({ users });
}
