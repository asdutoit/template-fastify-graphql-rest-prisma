import fp from "fastify-plugin";
import fjwt from "@fastify/jwt";

async function jwtPlugin(fastify, opts) {
  fastify.register(fjwt, { secret: process.env.JWT_SECRET });
}

export default fp(jwtPlugin, { name: "jwtPlugin" });
