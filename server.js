import { build } from "./app.js";

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

const fastify = build({
  logger: envToLogger["development"] ?? true,
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (error) {
    fastify.log.error(error);
    console.log("Server was shutdown");
    process.exit(1);
  }
};

start();
