const request = require("supertest");
const app = require("../app");

describe("App Health Check", () => {
  test("GET / should return welcome message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Welcome To StudyNotion",
    });
  });
});