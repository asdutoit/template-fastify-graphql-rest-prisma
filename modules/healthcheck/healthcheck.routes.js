async function healthcheckRoutes(fastify, options, next) {
  fastify.get("/healthcheck", async function (request, response) {
    request.log.info("healthcheck");
    return { status: "OK" };
  });
  next();
}

export default healthcheckRoutes;
