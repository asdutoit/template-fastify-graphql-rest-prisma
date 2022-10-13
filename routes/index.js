/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
  fastify.get("/shipwrecks", async (request, reply) => {
    const shipwrecks = await fastify.prisma.shipwrecks.findMany({
      where: {
        feature_type: "Wrecks - Submerged, nondangerous",
      },
    });
    return { shipwrecks: shipwrecks };
  });
  fastify.get("/gr", async (request, reply) => {
    const query = "{ add(x: 2, y: 2) }";
    return reply.graphql(query);
  });
}

export default routes;
