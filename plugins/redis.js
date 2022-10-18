import fp from "fastify-plugin";
import fastifyRedis from "@fastify/redis";
import IORedis from "ioredis";

const redis = new IORedis({
  host: "127.0.0.1",
  port: 55000,
  username: "default",
  password: "redispw",
});

async function redisPlugin(fastify, opts) {
  fastify.register(fastifyRedis, { client: redis });
}

export default fp(redisPlugin, { name: "redisPlugin" });
