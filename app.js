import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import Sensible from "@fastify/sensible";
import Env from "@fastify/env";
// import Cors from "@fastify/cors";
import S from "fluent-json-schema";
import { join } from "desm";
import routes from "./routes/index.js";
import fastifyPrintRoutes from "fastify-print-routes";
import userRoutes from "./modules/users/users.routes.js";

const envSchema = S.object()
  .prop("NODE_ENV", S.string().required())
  .prop("JWT_SECRET", S.string().required())
  .valueOf();

const options = {
  schema: envSchema,
  dotenv: true,
};

export function build(opts = {}) {
  const app = Fastify(opts);
  app
    .register(Env, options)
    .register(Sensible)
    .register(AutoLoad, {
      dir: join(import.meta.url, "plugins"),
    })
    .register(routes)
    .register(userRoutes)
    .ready((err) => {
      if (err) console.error(err);

      // console.log(fastify.config);
    });
  app.addHook("preHandler", (request, reply, next) => {
    // Adding the Prisma client to the request
    request.prisma = app.prisma;
    request.jwt = app.jwt;
    return next();
  });

  return app;
}
