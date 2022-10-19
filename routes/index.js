import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify, options) {
  // fastify.get("/", async (request, reply) => {
  //   return { hello: "world" };
  // });

  fastify.get("/healthcheck", async function (request, response) {
    request.log.info("healthcheck");
    return { status: "OK" };
  });

  fastify.get(
    "/shipwrecks",
    {
      onRequest: [fastify.authenticate],
    },
    (request, reply) => {
      fastify.cache.get("shipwrecks", (err, val) => {
        if (err) return reply.send(err);
        if (val) {
          const { item } = val;
          return reply.send(item);
        }

        fastify.prisma.shipwrecks
          .findMany({
            where: {
              feature_type: "Wrecks - Submerged, nondangerous",
            },
          })
          .then((response) => {
            fastify.cache.set(
              "shipwrecks",
              { shipwrecks: response },
              10000,
              (err) => {
                if (err) return reply.send(err);
                reply.send({ shipwrecks: response });
              }
            );
          });
      });
    }
  );

  fastify.post("/signup", (request, reply) => {
    // some code
    const { email } = request.body;
    const token = fastify.jwt.sign({ email }, process.env.JWT_SECRET);
    reply.send({ token });
  });
}

export default routes;
