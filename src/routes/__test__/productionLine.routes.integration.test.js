import request from "supertest";
import app from "src/app.js";
import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import mongoose from "mongoose";

describe("Production line routes", () => {
  let route, department;

  beforeEach(async () => {
    await request(app).post("/api/test/seedDB");

    department = await Department.findOne();
    route = `/api/departments/${department.id}/production-lines/`;
  });

  afterEach(async () => {
    await request(app).delete("/api/test/dropDB");
  });

  afterAll(async () => {
    await request(app).delete("/api/test/dropDB");
  });
  describe(`POST ${route}`, () => {
    test("should create a new productionLine and update it's department productionLine list", async () => {
      const newProductionLine = {
        lineName: "Test Line",
      };

      const response = await request(app).post(route).send(newProductionLine);
      const resBody = response.body;

      const updatedDepartment = await Department.findById(department.id);

      expect(response.statusCode).toBe(201);
      expect(resBody.data._id).toBeTruthy();
      expect(updatedDepartment.productionLines[0].toString()).toEqual(
        resBody.data._id
      );
    });

    test("should fail to create new production line when missing params", async () => {
      const response = await request(app).post(route).send();
      const resBody = response.body;

      const updatedDepartment = await Department.findById(department.id);

      expect(response.statusCode).toBe(400);
      expect(resBody.data).toBeFalsy();
      expect(updatedDepartment).toEqual(department);
    });
  });

  describe(`GET ${route}`, () => {
    test("should find all production lines", async () => {
      const response = await request(app).get(route);
      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data.length).toBe(3);
    });
    test("should fail to find production lines if non exist", async () => {
      await ProductionLine.deleteMany();

      const response = await request(app).get(route);
      const resBody = response.body;

      expect(response.statusCode).toBe(404);
      expect(resBody.message).toContain("Error");
    });
  });

  describe(`GET ${route}:_id`, async () => {
    test("should find production line matching given id", async () => {
      const productionLine = await ProductionLine.findOne();

      const response = await request(app).get(`${route}${productionLine.id}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data[0].lineName).toBe(productionLine.lineName);
    });
    test("should fail to find production line if invalid id provided", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app).get(`${route}${query}`);
      const resBody = response.body;

      console.log(resBody);

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe(`PATCH ${route}:_id`, async () => {
    test("should successfully update production line", async () => {});
    test("should fail to update production line if params not provided", async () => {});
    test("should fail to update production line if invalid id provided");
  });

  describe(`DELETE ${route}:_id`, async () => {
    test("should successfully delete production line", async () => {});
    test("should fail to delete production line if id not found", async () => {});
  });
});
