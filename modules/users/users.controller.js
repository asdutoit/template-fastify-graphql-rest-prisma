import { createUser, getUsers, deleteuser } from "./users.service.js";

export async function registerUser(request, reply) {
  const { prisma, jwt } = request;
  const user = await createUser({ ...request.body }, prisma);
  const token = await jwt.sign(user);
  reply.send({ token });
}

export async function getAllUsers(request, reply) {
  const { prisma, query } = request;
  const users = await getUsers(prisma);
  reply.send({ users, query });
}

export async function deleteUser(request, reply) {
  const { prisma } = request;
  const user = await deleteuser({ ...request.body }, prisma);
  reply.send({ user });
}
