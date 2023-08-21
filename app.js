import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import Sensible from "@fastify/sensible";
import Env from "@fastify/env";
import Cors from "@fastify/cors";
import S from "fluent-json-schema";
import { fileURLToPath } from "url";
import fs from "fs";
import path, { dirname } from "path";
import { join } from "desm";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import fastifyPrintRoutes from "fastify-print-routes";
import userRoutes from "./modules/users/users.routes.js";
import shipwrecksRoutes from "./modules/shipwrecks/shipwrecks.routes.js";
import healthcheckRoutes from "./modules/healthcheck/healthcheck.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envSchema = S.object()
  .prop("NODE_ENV", S.string().required())
  .prop("JWT_SECRET", S.string().required())
  .prop("REDIS_URL", S.string().required())
  .prop("REDIS_PORT", S.string().required())
  .prop("REDIS_PASSWORD", S.string().required())
  .prop("DATABASE_URL", S.string().required())
  .prop("REDIS_USERNAME", S.string().required())
  .prop("GOOGLE_OAUTH_CLIENT_ID", S.string().required())
  .prop("GOOGLE_OAUTH_CLIENT_SECRET", S.string().required())
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
    .register(Cors, {
      origin: "*", // allow all origins (BAD)
    })
    .register(AutoLoad, {
      dir: join(import.meta.url, "plugins"),
    })
    .register(fastifySecureSession, {
      key: fs.readFileSync(path.join(__dirname, "secret-key")),
      cookie: {
        path: "/",
      },
    })
    // .register(fastifyPassport.initialize())
    // .register(fastifyPassport.secureSession())
    .register(healthcheckRoutes)
    .register(userRoutes)
    .register(shipwrecksRoutes)
    .ready((err) => {
      if (err) console.error(err);

      // console.log(fastify.config);
    });
  fastifyPassport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        cb(undefined, profile);
      }
    )
  );
  // fastifyPassport.registerUserDeserializer(async (user, req) => {
  //   return user;
  // });

  // fastifyPassport.registerUserSerializer(async (user, req) => {
  //   return user;
  // });

  app.addHook("preHandler", (request, reply, next) => {
    // Adding the Prisma client to the request
    request.prisma = app.prisma;
    request.jwt = app.jwt;
    request.cache = app.cache;
    return next();
  });

  return app;
}
