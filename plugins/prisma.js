import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

const prismaPlugin = fp(async (server, options) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});

const prismaForGraphQL = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prismaForGraphQL;

export { prismaForGraphQL };
export default prismaPlugin;
