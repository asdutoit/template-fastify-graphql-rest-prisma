import { createUser, getUsers, deleteuser } from "./users.service.js";

export async function registerUser(request, reply) {
  const { prisma, jwt } = request;
  const user = await createUser({ ...request.body }, prisma);
  const token = await jwt.sign(user);
  reply.send({ token, id: user.id, email: user.email });
}

export async function getAllUsers(request, reply) {
  const { prisma, query, cache } = request;
  cache.get("shipwrecks", (err, val) => {
    console.log("cache reached 1", val);
    if (err) return reply.send(err);
    if (val) {
      const { item } = val;
      return reply.send(item);
    }

    prisma.shipwrecks
      .findMany({
        where: {
          feature_type: "Wrecks - Submerged, nondangerous",
        },
      })
      .then((response) => {
        cache.set("shipwrecks", { shipwrecks: response }, 10000, (err) => {
          if (err) return reply.send(err);
          reply.send({ shipwrecks: response });
        });
      });
  });
  // console.log("CACHE", cache);
  // cache.get("allusers", (err, val) => {
  //   return reply.send({ hello: "there" });
  //   // if (err) return reply.send(err);
  //   const { item } = val;
  //   console.log("SENDING VAL", item);
  //   // getUsers(prisma).then((response) => {
  //   //   console.log("response", response);
  //   //   cache.set("allusers", { response }, 1000000, (err, val) => {
  //   //     console.log("allusers", err, val);
  //   //     if (err) return reply.send("errrrrrrr()()()()()()()()()(", err);
  //   //     reply.send({ response });
  //   //   });
  //   // });
  // });
}

export async function deleteUser(request, reply) {
  const { prisma } = request;
  const user = await deleteuser({ ...request.body }, prisma);
  reply.send({ user });
}
