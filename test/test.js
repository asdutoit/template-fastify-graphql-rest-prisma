import { build } from "../app.js";
import assert from "assert";

let name = "Test User";
let email = "test@gmail.com";
let password = "P@ssword1";
let token = "";

describe("Healthcheck is OK", () => {
  let app;
  before(() => {
    app = build();
  });
  after(() => {
    app.close();
  });

  it("Should return statusCode 200", async () => {
    const response = await app.inject("/healthcheck");
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), { status: "OK" });
  });
  it("Should return OK", async () => {
    const response = await app.inject("/healthcheck");
    assert.deepEqual(response.json(), { status: "OK" });
  });
});

describe("Create a new user", () => {
  let app;
  before(() => {
    app = build();
  });
  after(() => {
    app.close();
  });

  it("Should return statusCode 200", async () => {
    let pattern = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;

    const response = await app.inject({
      method: "POST",
      url: "/register",
      body: {
        name,
        email,
        password,
      },
    });
    // console.log(response.body);
    const responseBody = JSON.parse(response.body);
    token = responseBody.token;
    assert.equal(response.statusCode, 200);
    assert.match(responseBody.token, pattern, "The token is valid");
  });
});

describe("Delete the new user", () => {
  let app;
  before(() => {
    app = build();
  });
  after(() => {
    app.close();
  });

  it("Should return status code 204", async () => {
    let token;

    const responseLogin = await app.inject({
      method: "POST",
      url: "/login",
      body: {
        email,
        password,
      },
    });
    const responseBody = await JSON.parse(responseLogin.body);
    // console.log("login response", responseBody);
    token = responseBody.token;

    const response = await app.inject({
      method: "POST",
      url: "/deleteuser",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        email,
      },
    });
    assert.equal(response.statusCode, 204);
  });
});
