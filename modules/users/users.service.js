import bcrypt from "bcryptjs";

async function login(input, prisma) {
  const { email, password } = input;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return false;
    } else {
      return user;
    }
  } catch (error) {
    throw Error("User does not exist or Password is incorrect");
  }
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function createUser(input, prisma) {
  const { password, ...rest } = input;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: rest.email,
      },
    });
    if (existingUser) {
      throw Error("User already exists");
    } else {
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
    }
  } catch (error) {
    throw Error(error);
  }
}

async function deleteuser(input, prisma) {
  const { email, id } = input;
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

export { createUser, getUsers, deleteuser, login, verifyPassword };
