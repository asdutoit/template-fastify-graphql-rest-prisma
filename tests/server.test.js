import { test } from "tap";
import { build } from "../app.js";

test("requests to healthcheck route", async (t) => {
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

test("create new user", async (t) => {
  let pattern = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;
  const fastify = build();

  // fastify.addHook("onClose", () => redis.quit());
  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/register",
    body: {
      name: "Test User",
      email: "testuser@test.co.za",
      password: "P@ssword1",
    },
  });
  const responseBody = JSON.parse(response.body);
  console.log("USER CREATED ^^^^^^^^^^^^^:", responseBody);
  t.equal(response.statusCode, 200);
  t.match(responseBody.token, pattern, "The token is valid");

  //TODO: Remember to delete the created user from the DB
  const deleteResponse = await fastify.inject({
    method: "POST",
    headers: {
      authorization: `Bearer ${responseBody.token}`,
    },
    url: "/deleteuser",
    body: {
      email: "testuser@test.co.za",
      id: responseBody.id,
    },
  });

  console.log("DELETEDUSER ^^^^^^^^: ", deleteResponse.body);

  t.equal(response.statusCode, 200);
  t.match(responseBody.token, pattern, "The token is valid");
});
