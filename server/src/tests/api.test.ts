import mongoose from "mongoose";

import app from "../app";
import request from "supertest";

describe("User Model Test", () => {
  // connect to the MongoDB Memory Server

  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const userData = {
    firstname: "first",
    lastname: "name",
    email: "user@gmail.com",
    password: "password",
  };

  it("POST: 201 - create user and return JWT", async () => {
    await request(app)
      .post("/api/user")
      .send(userData)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("token");
        expect(typeof body.token).toBe("string");
      });
  });

  it("POST: 400 - responds with an appropriate error when the same user credentials are supplied", async () => {
    await request(app)
      .post("/api/user")
      .send(userData)
      .expect(400)
      .then(({ body: { errors } }) => {
        expect(errors[0].msg).toBe("User already exists");
      });
  });

  it("POST: 400 - responds with an appropriate error when incomplete user credentials are supplied", async () => {
    const incompleteUserData = {
      firstname: "first",
      email: "anotheruser@gmail.com",
      password: "password",
    };
    await request(app)
      .post("/api/user")
      .send(incompleteUserData)
      .expect(400)
      .then(({ body: { errors } }) => {
        expect(errors[0].msg).toBe("Lastname is required");
      });
  });
});
