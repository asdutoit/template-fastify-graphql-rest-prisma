import fp from "fastify-plugin";
import mercurius from "mercurius";
import mercuriusCache from "mercurius-cache";
import { schema, resolvers } from "../graphql/index.js";
import { prismaForGraphQL } from "./prisma.js";
import IORedis from "ioredis";

async function graphqPlugin(fastify, opts, done) {
  const redis = new IORedis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    namespace: "Redis Graphql",
  });
  fastify.register(mercurius, {
    schema,
    resolvers,
    context: (request, reply) => {
      return { prismaForGraphQL };
    },
    graphiql: eval(process.env.GRAPHQLCLIENT),
  });
  // fastify.addHook("onClose", () => redis.quit());
  // ===========  Cache for GRAPHQL  ===========
  fastify.addHook("onClose", () => redis.quit());
  fastify.register(mercuriusCache, {
    ttl: 10,
    policy: {
      Query: {
        shipwrecks: true,
      },
    },
    storage: {
      type: "redis",
      options: {
        client: redis,
        closeClient: true,
        invalidation: {
          referencesTTL: 60,
        },
      },
    },
    onDedupe: function (type, fieldName) {
      fastify.log.info({ msg: "deduping", type, fieldName });
    },
    onHit: function (type, fieldName) {
      fastify.log.info({ msg: "hit from cache", type, fieldName });
    },
    onMiss: function (type, fieldName) {
      fastify.log.info({ msg: "miss from cache", type, fieldName });
    },
    onSkip: function (type, fieldName) {
      fastify.log.info({ msg: "skip cache", type, fieldName });
    },
    logInterval: 3600,
    // caching stats
    logReport: (report) => {
      fastify.log.info({ msg: "cache stats" });
      console.table(report);
    },
  });

  done();
}

export default fp(graphqPlugin, {
  name: "graphqPlugin",
});
