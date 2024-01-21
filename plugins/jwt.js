import fp from "fastify-plugin";
import fjwt from "@fastify/jwt";
import jwt from "jsonwebtoken";

const signToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET);
};

const verifyTokenFromCtx = (authorization) => {
  const token = authorization.replace("Bearer", "").trim();
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyToken = (authorization) => {
  const token = authorization.replace("Bearer", "").trim();
  return jwt.verify(token, process.env.JWT_SECRET);
};

async function jwtPlugin(fastify, opts) {
  fastify.register(fjwt, { secret: process.env.JWT_SECRET });
}

export { signToken, verifyTokenFromCtx, verifyToken };
export default fp(jwtPlugin, { name: "jwtPlugin" });
