import fp from "fastify-plugin";
import fastifyRedis from "@fastify/redis";
import IORedis from "ioredis";

async function redisPlugin(fastify, opts, done) {
  const redis = new IORedis({
    host: "127.0.0.1",
    port: 55000,
    username: "default",
    password: "redispw",
    namespace: "Redis Main Plugin",
  });
  fastify.addHook("onClose", () => redis.quit());
  fastify.register(fastifyRedis, { client: redis, closeClient: true });
  done();
}

export default fp(redisPlugin, { name: "redisPlugin" });
