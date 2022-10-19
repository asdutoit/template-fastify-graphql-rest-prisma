import { test } from "tap";
import { build } from "../app.js";

test("requests to healthcheck route", async (t) => {
  //FIXME:  Tests are failing due to what seems to be related to the Redis plugin (plugins/redis.js).   Redis is used in: Graphql (plugins/graphql.js), Caching (plugins/caching.js)
  const fastify = build();

  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "GET",
    url: "/",
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { hello: "worlds" });
});
