import { verifyTokenFromCtx } from "../plugins/jwt.js";

const schema = `
directive @auth(
  requires: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  USER
}

type Query {
  add(x: Int, y: Int): Int
  books: [Book]
  shipwrecks: [Shipwrecks]
}
type Book {
  title: String
  author: String
}

type Point {
	longitude: Float!
	latitude: Float!
}

type PointList {
	points: [Point!]!
}

type Shipwrecks {
  feature_type: String
  coordinates: [Float]
}
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },

  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
    books: () => books,
    shipwrecks: async (_parent, args, ctx) => {
      const { userInfo } = ctx;
      console.log("userInfo", userInfo);
      if (!userInfo || userInfo === null) {
        throw new Error("No user found for this Id");
      }
      return ctx.prismaForGraphQL.shipwrecks.findMany({
        where: {
          feature_type: "Wrecks - Submerged, nondangerous",
        },
      });
    },
  },
};

export { schema, resolvers };
