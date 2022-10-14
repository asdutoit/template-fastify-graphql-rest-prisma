import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.get("/healthcheck", async function (request, response) {
    request.log.info("healthcheck");
    return { status: "OK" };
  });

  fastify.get(
    "/shipwrecks",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const shipwrecks = await fastify.prisma.shipwrecks.findMany({
        where: {
          feature_type: "Wrecks - Submerged, nondangerous",
        },
      });
      return { shipwrecks: shipwrecks };
    }
  );

  fastify.post("/signup", (request, reply) => {
    // some code
    const { email } = request.body;
    const token = fastify.jwt.sign({ email });
    reply.send({ token });
  });
}

export default routes;
