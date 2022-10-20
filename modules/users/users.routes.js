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

  // fastify.get(
  //   "/allusers",
  //   // allUsersSchema,
  //   // {
  //   //   onRequest: [fastify.authenticate],
  //   // },
  //   getAllUsers
  // );
  fastify.get("/allusers", (request, reply) => {
    fastify.cache.get("allusers", (err, val) => {
      if (err) return reply.send(err);
      if (val) return reply.send(val.item);
      fastify.prisma.user
        .findMany({
          select: {
            email: true,
          },
        })
        .then((response) => {
          fastify.cache.set("allusers", { response }, 1000, (err, val) => {
            if (err) return reply.send(err);
            reply.send({ allusers: response });
          });
        });
    });
  });

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
