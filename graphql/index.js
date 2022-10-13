const schema = `
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
      return ctx.prismaForGraphQL.shipwrecks.findMany({
        where: {
          feature_type: "Wrecks - Submerged, nondangerous",
        },
      });
    },
  },
};

export { schema, resolvers };
