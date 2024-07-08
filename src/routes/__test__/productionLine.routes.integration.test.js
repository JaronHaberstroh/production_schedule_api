import ProductionLine from "#models/productionLine";
import Department from "#models/department";
import request from "supertest";
import app from "src/app";
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

  describe(`POST /api/departments/:departmentId/production-lines/`, () => {
    test("should create a new productionLine and update it's department productionLine list", async () => {
      const newProductionLine = {
        lineName: "Test Line",
      };

      const response = await request(app).post(route).send(newProductionLine);
      const resBody = response.body;

      const updatedDepartment = await Department.findById(department.id);

      expect(response.statusCode).toBe(201);
      expect(resBody.data.productionLine._id).toBeTruthy();
      expect(updatedDepartment.productionLines[3].toString()).toEqual(
        resBody.data.productionLine._id,
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

  describe(`GET /api/departments/:departmentId/production-lines/`, () => {
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

  describe(`GET /api/departments/:departmentId/production-lines/:_id`, () => {
    test("should find production line matching given id", async () => {
      const productionLine = await ProductionLine.findOne();

      const response = await request(app).get(`${route}${productionLine.id}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data.lineName).toBe(productionLine.lineName);
    });

    test("should fail to find production line if invalid id provided", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app).get(`${route}${query}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe(`PATCH /api/departments/:departmentId/production-lines/:_id`, () => {
    test("should successfully update production line", async () => {
      const productionLine = await ProductionLine.findOne({
        department: department.id,
      });

      const departmentList = await Department.find();

      const params = {
        department: departmentList[1].id,
        lineName: "New Line Name",
      };

      const response = await request(app)
        .patch(`${route}${productionLine.id}`)
        .send(params);
      const resBody = response.body;

      const updatedDepartment = await Department.findById(params.department);

      expect(response.statusCode).toBe(200);
      expect(resBody.data.productionLine.lineName).toBe(params.lineName);
      expect(resBody.data.productionLine.department).toBe(params.department);
      expect(updatedDepartment.productionLines.length).toBe(4);
      expect(updatedDepartment.productionLines[3].toString()).toBe(
        productionLine.id,
      );
    });

    test("should fail to update production line if params not provided", async () => {
      const productionLine = await ProductionLine.findOne({
        department: department.id,
      });

      const response = await request(app)
        .patch(`${route}${productionLine.id}`)
        .send();
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });

    test("should fail to update production line if invalid id provided", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const response = await request(app).patch(`${route}${invalidId}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe(`DELETE /api/departments/:departmentId/production-lines/:_id`, () => {
    test("should successfully delete production line", async () => {
      const departmentId = department.id;

      const productionLine = await ProductionLine.findOne({
        department: departmentId,
      });

      const response = await request(app).delete(
        `${route}${productionLine.id}`,
      );
      const resBody = response.body;

      const deletedProductionLine = await ProductionLine.findById(
        productionLine.id,
      );

      const updatedDepartment = await Department.findById(departmentId);

      expect(response.statusCode).toBe(200);
      expect(resBody.message).toContain("Success");
      expect(deletedProductionLine).toBe(null);
      expect(updatedDepartment.productionLines).not.toContain(
        productionLine.id,
      );
    });

    test("should fail to delete production line if id not found", async () => {
      const productionLineId = new mongoose.Types.ObjectId();

      const response = await request(app).delete(`${route}${productionLineId}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });
});
