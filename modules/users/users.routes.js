import { registerUser, getAllUsers, deleteUser } from "./users.controller.js";
import {
  userCore,
  userSchema,
  registerSchema,
  allUsersSchema,
} from "./users.schemas.js";
import S from "fluent-json-schema";

async function userRoutes(fastify, options, next) {
  fastify.get("/", async (request, reply) => {
    return { hello: "worlds" };
  });
  fastify.post("/register", registerSchema, registerUser);
  fastify.post(
    "/deleteuser",
    { onRequest: [fastify.authenticate] },
    deleteUser
  );

  fastify.get("/allusers", {schema: allUsersSchema, onRequest: [fastify.authenticate]}, getAllUsers);

  next();
}

const User = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
  },
};

export default userRoutes;


// fastify.cache.get("allusers", (err, val) => {
//   if (err) return reply.send(err);
//   if (val) return reply.send(val.item);
//   fastify.prisma.user
//     .findMany({
//       select: {
//         email: true,
//       },
//     })
//     .then((response) => {
//       fastify.cache.set("allusers", { response }, 100000, (err, val) => {
//         if (err) return reply.send(err);
//         reply.send({ allusers: response });
//       });
//     });
// });