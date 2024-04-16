// @vitest-environment integration

import request from "supertest";
import app from "./src/app.js";
import Department from "#models/department.js";
import mongoose from "mongoose";

describe("Department Routes", () => {
  let testDepartments;
  beforeAll(async () => {
    // Set test variables
    testDepartments = [
      { departmentName: "test" },
      { departmentName: "test2" },
      { departmentName: "test3" },
      { departmentName: "test4" },
    ];
  });

  beforeEach(async () => {
    // Populate Department collection
    await Department.insertMany(testDepartments);
  });

  afterEach(async () => {
    // Empty Department collection
    await Department.deleteMany();
  });

  describe("POST /api/department/post", () => {
    test("should return success response", async () => {
      // Make request to endpoint
      const response = await request(app)
        .post("/api/department/create")
        .send({ departmentName: "testing" });

      // Expect success response
      expect(response.statusCode).toBe(201);
    });

    test("should return failure response", async () => {
      // Make request to endpoint
      const response = await request(app).post("/api/department/create");

      // Expect fail response
      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/department/read", () => {
    // Set test variables
    const route = "/api/department/read";
    test("should return success response", async () => {
      // Make request to endpoint
      const response = await request(app).get(route);

      // Expect success response
      expect(response.statusCode).toBe(200);
    });

    test("should return failure response", async () => {
      // Empty department collection
      await Department.deleteMany();

      // Make request to endpoint
      const response = await request(app).get(route);

      // Expect not found response
      expect(response.statusCode).toBe(404);
    });
  });

  describe("GET /api/department/read/:_id", () => {
    // Set test variables
    const route = "/api/department/read/";
    test("should return success response", async () => {
      // Find DB items
      const result = await Department.find();

      // Set query
      const query = result[0]._id.toString();

      // Make request to endpoint
      const response = await request(app).get(`${route}${query}`);

      // Expect success response
      expect(response.statusCode).toBe(200);
    });

    test("should return failure response if invalid _id provided", async () => {
      // Set query
      const query = new mongoose.Types.ObjectId();

      // Make request to endpoint
      const response = await request(app).get(`${route}${query}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /api/department/update/:_id", () => {
    // Set test variables
    const route = "/api/department/update/";
    let result, query, params;
    beforeEach(async () => {
      // Find DB items
      result = await Department.find();

      // Set query
      query = result[0]._id.toString();

      // Set params
      params = { departmentName: "starship construction" };
    });

    test("should return success response", async () => {
      // Make request to endpoint
      const response = await request(app)
        .patch(`${route}${query}`)
        .send(params);

      // Expect success response
      expect(response.statusCode).toBe(200);
    });

    test("should return error if params not provided", async () => {
      // Make request to endpoint
      const response = await request(app).patch(`${route}${query}`).send();

      // Expect failure response
      expect(response.statusCode).toBe(400);
    });

    test("should fail if invalid _id provided", async () => {
      // Set query
      query = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`${route}${query}`)
        .send(params);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/department/delete/:_id", () => {
    // Set test variables
    const route = "/api/department/delete/";
    let result, query;
    beforeEach(async () => {
      // Find DB items
      result = await Department.find();

      // Set query
      query = result[0]._id.toString();
    });

    test("should return success response", async () => {
      // Make request to endpoint
      const response = await request(app).delete(`${route}${query}`);

      expect(response.statusCode).toBe(200);
    });

    test("should fail if _id not found", async () => {
      // Set query
      query = new mongoose.Types.ObjectId();

      // Make request to endpoint
      const response = await request(app).delete(`${route}${query}`);

      expect(response.statusCode).toBe(404);
    });
  });
});
