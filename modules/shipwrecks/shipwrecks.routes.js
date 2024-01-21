async function shipwrecksRoutes(fastify, options, next) {
  fastify.get(
    "/shipwrecks",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const result = await fastify.cache.get("shipwrecks");
        if (result) {
          const { item } = result;
          return reply.send({ cache: "Hit", item });
        } else {
          const shipwrecks = await fastify.prisma.shipwrecks.findMany({
            where: {
              feature_type: "Wrecks - Submerged, nondangerous",
            },
          });
          await fastify.cache.set("shipwrecks", { shipwrecks }, 100000);
          return reply.send({ cache: "Miss", shipwrecks });
        }
      } catch (error) {
        reply.send(error);
      }
    }
  );

  next();
}

export default shipwrecksRoutes;
