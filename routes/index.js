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

  fastify.put(
    "/some-route/",
    {
      schema: {
        description: "post some data",
        tags: ["user", "code"],
        summary: "qwerty",
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "user id",
            },
          },
        },
        body: {
          type: "object",
          properties: {
            hello: { type: "string" },
            obj: {
              type: "object",
              properties: {
                some: { type: "string" },
              },
            },
          },
        },
        response: {
          201: {
            description: "Successful response",
            type: "object",
            properties: {
              hello: { type: "string" },
            },
          },
          default: {
            description: "Default response",
            type: "object",
            properties: {
              foo: { type: "string" },
            },
          },
        },
        security: [
          {
            apiKey: [],
          },
        ],
      },
    },
    (req, reply) => {}
  );
}

export default routes;
