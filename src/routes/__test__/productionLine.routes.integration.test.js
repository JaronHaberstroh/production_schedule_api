import request from "supertest";
import app from "src/app.js";
import Department from "#models/department.js";

describe("Production line routes", () => {
  let route;

  beforeEach(async () => {
    const result = await request(app).post("/api/test/seedDB");
    console.log(result.body.message);

    const department = await Department.findOne();
    route = `/api/departments/${department.id}/production-lines/`;
  });

  afterEach(async () => {
    const result = await request(app).delete("/api/test/dropDB");
    console.log(result.body.message);
  });

  afterAll(async () => {
    const result = await request(app).delete("/api/test/dropDB");
    console.log("DropDB after all tests finish", result.body.message);
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
