import S from "fluent-json-schema";

const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const registerBodySchema = S.object()
  .prop("name", S.string().required())
  .prop("email", S.string().minLength(8).required())
  .prop("password", S.string().minLength(8).required())
  .prop("role", S.string().enum(Object.values(ROLES)).default(ROLES.USER));

const registerResponseSchema = S.object().prop("token", S.string());
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

export { userCore, userSchema, registerSchema };
