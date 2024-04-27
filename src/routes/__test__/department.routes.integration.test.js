import request from "supertest";
import app from "./src/app.js";
import Department from "#models/department.js";
import mongoose from "mongoose";
import { expect } from "node_modules/vitest/dist/index.js";

describe("Department Routes", () => {
  // Set test variables
  const testDepartments = [
    { departmentName: "test" },
    { departmentName: "test2" },
    { departmentName: "test3" },
    { departmentName: "test4" },
  ];

  beforeEach(async () => {
    // Populate Department collection
    await Department.insertMany(testDepartments);
  });

  afterEach(async () => {
    // Empty Department collection
    await Department.deleteMany();
  });

  describe("POST /api/department/post", () => {
    const route = "/api/department/create";
    test("should create a new department successfully", async () => {
      const newDepartment = { departmentName: "testing" };

      const response = await request(app).post(route).send(newDepartment);
      const resBody = response.body;

      const result = await Department.findOne(newDepartment);

      expect(response.statusCode).toBe(201);
      expect(result.departmentName).toBe(newDepartment.departmentName);
      expect(resBody.data._id).toBeTruthy();
    });

    test("should fail to create new deparment when missing params", async () => {
      const response = await request(app).post(route);

      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe("GET /api/department/read", () => {
    const route = "/api/department/read";
    test("should find all departments", async () => {
      const response = await request(app).get(route);

      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data.length).toBe(4);
    });

    test("should fail to find departments if non exist", async () => {
      // Empty department collection to force fail to find
      await Department.deleteMany();

      const response = await request(app).get(route);
      const resBody = response.body;

      expect(response.statusCode).toBe(404);
      expect(resBody.message).toContain("Error");
    });
  });

  describe("GET /api/department/read/:id", () => {
    const route = "/api/department/read/";
    test("should find department matching given id", async () => {
      const department = await Department.findOne();

      const response = await request(app).get(`${route}${department.id}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data[0].departmentName).toBe(department.departmentName);
    });

    test("should fail to find departments if invalid id provided", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app).get(`${route}${query}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe("POST /api/department/update/:_id", async () => {
    const route = "/api/department/update/";

    const params = { departmentName: "starship construction" };

    test("should successfully update department document", async () => {
      const department = await Department.findOne();

      const response = await request(app)
        .patch(`${route}${department.id}`)
        .send(params);

      const result = await Department.findOne({ _id: department.id });

      expect(response.statusCode).toBe(200);
      expect(result.departmentName).toBe(params.departmentName);
    });

    test("should fail to update department document if params not provided", async () => {
      const department = await Department.findOne();

      const response = await request(app)
        .patch(`${route}${department.id}`)
        .send();
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });

    test("should fail to update department document if invalid provided", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`${route}${query}`)
        .send(params);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe("DELETE /api/department/delete/:_id", () => {
    const route = "/api/department/delete/";

    test("should successfully delete department", async () => {
      const department = await Department.findOne();

      const response = await request(app).delete(`${route}${department.id}`);

      const result = await Department.findOne({ _id: department.id });

      expect(response.statusCode).toBe(200);
      expect(result).toBe(null);
    });

    test("should fail to delete department if id not found", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app).delete(`${route}${query}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });
});
