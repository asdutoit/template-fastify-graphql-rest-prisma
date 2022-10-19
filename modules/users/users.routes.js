import { registerUser, getAllUsers } from "./users.controller.js";
import { userCore, userSchema, registerSchema } from "./users.schemas.js";
import S from "fluent-json-schema";

async function userRoutes(fastify, options, next) {
  fastify.get("/", async (request, reply) => {
    return { hello: "worlds" };
  });
  fastify.post("/register", registerSchema, registerUser);

  fastify.get(
    "/allusers",
    {
      onRequest: [fastify.authenticate],
      schema: {
        response: {
          201: S.object().prop("created", S.boolean()),
        },
      },
    },
    getAllUsers
  );

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

// async function userRoutes(fastify, options, next) {
//   fastify
//     .route({
//       method: "GET",
//       url: "/",
//       handler: async (request, reply) => {
//         return { hello: "worlds" };
//       },
//     })
//     .route({
//       method: "POST",
//       url: "/register",
//       schema: {
//         description: "Register a new user",
//         body: userCore,
//         response: {
//           201: S.object().prop("created", S.boolean()),
//         },
//       },
//       handler: registerUser,
//     })
//     .route({
//       method: "GET",
//       url: "/allusers",
//       onRequest: [fastify.authenticate],
//       schema: {
//         response: {
//           201: { type: "object", properties: {} },
//         },
//       },
//       handler: getAllUsers,
//     });

//   next();
// }

export default userRoutes;
