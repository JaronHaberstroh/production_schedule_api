import request from "supertest";
import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import app from "src/app.js";

describe("Production line routes", () => {
  let route;
  beforeEach(async () => {
    // Seed DB
    const seedParams = { Department, ProductionLine };
    await seedDB(seedParams);

    const department = await Department.find();
    const departmentId = department[0].id;

    route = `/api/departments/${departmentId}/production-lines/`;
  });

  afterEach(() => {});

  test("should create a new productionLine and update it's department productionLine list", async () => {
    const newProductionLine = {
      lineName: "Test Line",
    };

    const response = await request(app).post(route).send(newProductionLine);
    const resBody = response.body;

    expect(response.statusCode).toBe(201);
  });
});
