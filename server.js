import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import Sensible from "@fastify/sensible";
import Env from "@fastify/env";
import Cors from "@fastify/cors";
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

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
        singleLine: false,
      },
    },
    production: true,
    test: false,
  },
};
const fastify = Fastify({
  logger: envToLogger[process.env.NODE_ENV] ?? true,
});

fastify
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

fastify.decorateRequest("fastify", fastify);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
