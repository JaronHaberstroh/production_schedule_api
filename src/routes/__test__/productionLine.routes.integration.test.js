import request from "supertest";
import app from "src/app.js";
import Department from "#models/department.js";

describe("Production line routes", () => {
  let route;

  beforeEach(async () => {
    await request(app).post("/api/test/seedDB");

    const department = await Department.findOne();
    route = `/api/departments/${department.id}/production-lines/`;
  });

  afterEach(async () => {
    await request(app).delete("/api/test/dropDB");
  });

  afterAll(async () => {
    await request(app).delete("/api/test/dropDB");
  });

  test("should create a new productionLine and update it's department productionLine list", async () => {
    const newProductionLine = {
      lineName: "Test Line",
    };

    const response = await request(app).post(route).send(newProductionLine);
    const resBody = response.body;

    expect(response.statusCode).toBe(201);
  });
});
