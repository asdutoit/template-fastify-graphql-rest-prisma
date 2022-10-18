import fp from "fastify-plugin";
import fastifyCaching from "@fastify/caching";
import abstractCacheRedis from "abstract-cache";
import IORedis from "ioredis";

const redis = new IORedis({
  host: "127.0.0.1",
  port: 55000,
  username: "default",
  password: "redispw",
});
const abcache = abstractCacheRedis({
  useAwait: false,
  driver: {
    name: "abstract-cache-redis",
    options: { client: redis },
  },
});

async function cachingPlugin(fastify, opts) {
  // ===========  Cache for the RESTAPI  ===========
  fastify.register(
    fastifyCaching,
    {
      privacy: "public",
      expiresIn: 100,
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
