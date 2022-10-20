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
        console.log("cache reached 1", val);
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
}

export default routes;
