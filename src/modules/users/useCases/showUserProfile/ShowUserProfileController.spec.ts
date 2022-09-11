import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show a user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "test@email.com",
      password: "123456",
    });

    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "test@email.com",
      password: "123456",
    });

    const { token } = sessions.body;

    const showUserProfile = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(showUserProfile.status).toBe(200);
  });

  it("should not be able to show a non-existing user profile", async () => {
    const token = "invalid_token";

    const showUserProfile = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(showUserProfile.status).toBe(401);
  });
});
