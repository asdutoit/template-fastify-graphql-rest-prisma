import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
} from "./users.controller.js";

import {
  registerSchema,
  allUsersSchema,
  loginSchema,
} from "./users.schemas.js";

async function userRoutes(fastify, options, next) {
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
    },
    async function (request, reply) {
      return request.user;
    }
  );
  fastify.post("/register", registerSchema, registerUser);
  fastify.post("/login", loginSchema, loginUser);
  fastify.post(
    "/deleteuser",
    {
      onRequest: [fastify.authenticate],
    },
    deleteUser
  );

  fastify.get(
    "/allusers",
    {
      schema: allUsersSchema,
      onRequest: [fastify.authenticate],
    },
    getAllUsers
  );

  next();
}

export default userRoutes;
