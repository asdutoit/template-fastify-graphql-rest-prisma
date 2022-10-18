import S from "fluent-json-schema";

const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
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

export { userCore, userSchema };
