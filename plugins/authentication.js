import fp from "fastify-plugin";

const authPlugin = fp(
  async function (fastify, opts, done) {
    fastify.decorate("authenticate", async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    });
    done();
  },
  { name: "authentication" }
);

export default authPlugin;
