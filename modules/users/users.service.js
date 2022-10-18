// import { userCore, userSchema } from "./users.schemas.js";
import bcrypt from "bcryptjs";
import { ReplyError } from "ioredis";

async function createUser(input, prisma) {
  const { password, ...rest } = input;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = await prisma.user.create({
      data: {
        ...rest,
        salt,
        password: hashedPassword,
      },
    });
    console.log("user", user);
    return user;
  } catch (error) {
    console.log("Create user error", error);
  }
}

async function getUsers(prisma) {
  const users = await prisma.user.findMany({});
  return users;
}

export { createUser, getUsers };
