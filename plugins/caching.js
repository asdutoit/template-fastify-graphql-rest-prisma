import fp from "fastify-plugin";
import fastifyCaching from "@fastify/caching";
import abstractCacheRedis from "abstract-cache";
import IORedis from "ioredis";

async function cachingPlugin(fastify, opts) {
  const redis = new IORedis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    namespace: "Redis Caching Plugin",
  });
  fastify.log.info({actor: "Redis Caching Plugin"}, redis.status);
  const abcache = abstractCacheRedis({
    useAwait: true,
    driver: {
      name: "abstract-cache-redis",
      options: { client: redis, closeClient: true },
    },
  });
  // ===========  Cache for the RESTAPI  ===========
  fastify.addHook("onClose", () => redis.quit());
  fastify.register(
    fastifyCaching,
    {
      privacy: "public",
      expiresIn: 100000,
      cache: abcache,
    },
    (error) => {
      if (error) throw error;
    }
  );
}

export default fp(cachingPlugin, {
  name: "cachingPlugin",
});
