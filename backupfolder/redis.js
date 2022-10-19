import fp from "fastify-plugin";
import fastifyRedis from "@fastify/redis";
import IORedis from "ioredis";

const redis = new IORedis({
  host: "127.0.0.1",
  port: 55000,
  username: "default",
  password: "redispw",
  namespace: "Redis Main Plugin",
});

async function redisPlugin(fastify, opts) {
  fastify.register(fastifyRedis, { client: redis, closeClient: true });
}

export default fp(redisPlugin, { name: "redisPlugin" });
