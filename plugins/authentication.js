import fp from "fastify-plugin";

async function authPlugin(fastify, opts, done) {
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
  done();
}

export default fp(authPlugin, { authPlugin });
