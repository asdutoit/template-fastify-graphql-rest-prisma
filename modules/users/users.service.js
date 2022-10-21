// import { userCore, userSchema } from "./users.schemas.js";
import bcrypt from "bcryptjs";

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
      select: {
        email: true,
        name: true,
        role: true,
        id: true,
      },
    });
    return user;
  } catch (error) {
    throw Error(error);
  }
}

async function deleteuser(input, prisma) {
  const { email, id } = input;
  console.log("DELETE USER SERVICE ", email, id);
  try {
    const res = await prisma.user.delete({
      where: {
        id,
      },
    });
    return res;
  } catch (error) {
    throw Error(error);
  }
}

async function getUsers(prisma) {
  const users = await prisma.user.findMany({
    select: {
      email: true,
    },
  });
  return users;
}

export { createUser, getUsers, deleteuser };
