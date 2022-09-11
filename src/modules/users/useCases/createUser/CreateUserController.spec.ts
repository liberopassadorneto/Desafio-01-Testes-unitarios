import { Connection } from "typeorm";
import createConnection from "../../../../database/index";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a user", async () => {
    const user = await request(app).post("/users").send({
      name: "John Doe",
      email: "test@email.com",
      password: "123456",
    });

    console.log(user.status);
  });
});
