import S from "fluent-json-schema";

const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const allUsersResponseSchema = S.object().prop(
  "users",
  S.array().items(S.object().prop("email", S.string()))
);

const allUsersSchema = {
  schema: {
    response: { 200: allUsersResponseSchema },
  },
};

const loginBodySchema = S.object()
  .prop("email", S.string().minLength(8).required())
  .prop("password", S.string().minLength(8).required());

const loginResponseSchema = S.object()
  .prop("cache", S.string())
  .prop("token", S.string())
  .prop("email", S.string())
  .prop("role", S.string())
  .prop("id", S.string());

const loginSchema = {
  schema: {
    response: { 200: loginResponseSchema },
    body: loginBodySchema,
  },
};

const registerBodySchema = S.object()
  .prop("name", S.string().required())
  .prop("email", S.string().minLength(8).required())
  .prop("password", S.string().minLength(8).required())
  .prop("role", S.string().enum(Object.values(ROLES)).default(ROLES.USER))
  .prop("id", S.string());

const registerResponseSchema = S.object()
  .prop("token", S.string())
  .prop("email", S.string())
  .prop("id", S.string());

const registerSchema = {
  schema: {
    response: { 200: registerResponseSchema },
    body: registerBodySchema,
  },
};

// User schema
const userCore = S.object()
  .prop("email", S.string())
  .prop("password", S.string())
  .prop("name", S.string())
  .prop("role", S.string().enum(Object.values(ROLES)).default(ROLES.USER));

const userSchema = S.object()
  .prop("id", S.string())
  .prop("createdAt", S.string().format("time"))
  .prop("updatedAt", S.string().format("time"))
  .extend(userCore);

export { userCore, userSchema, registerSchema, allUsersSchema, loginSchema };
