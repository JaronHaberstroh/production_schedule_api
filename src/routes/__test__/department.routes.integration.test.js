import request from "supertest";
import app from "./src/app.js";
import Department from "#models/department.js";
import mongoose from "mongoose";

describe("Department Routes", () => {
  const route = "/api/departments/";

  beforeEach(async () => {
    const result = await request(app).post("/api/test/seedDB");
    console.log(result.body.message);
  });

  afterEach(async () => {
    const result = await request(app).delete("/api/test/dropDB");
    console.log(result.body.message);
  });

  afterAll(async () => {
    const result = await request(app).delete("/api/test/dropDB");
    console.log("DropDB after all tests finish", result.body.message);
  });

  describe("POST /api/department/", () => {
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

  describe("GET /api/department/", () => {
    test("should find all departments", async () => {
      const response = await request(app).get(route);

      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data.length).toBe(5);
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

  describe("GET /api/department/:id", () => {
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

  describe("POST /api/department/:_id", async () => {
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

  describe("DELETE /api/department/:_id", () => {
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
