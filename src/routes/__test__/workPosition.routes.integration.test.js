import request from "supertest";
import app from "src/app.js";
import WorkPosition from "#models/workPosition.js";
import mongoose from "mongoose";

describe("Work Position Routes", () => {
  const route = "/api/work-positions/";

  beforeEach(async () => {
    await request(app).post("/api/test/seedDB");
  });

  afterEach(async () => {
    await request(app).delete("/api/test/dropDB");
  });

  afterAll(async () => {
    await request(app).delete("/api/test/dropDB");
  });

  describe(`POST ${route}`, () => {
    test("should create a new work position successfully", async () => {
      const newWorkPosition = { positionName: "testing" };

      const response = await request(app).post(route).send(newWorkPosition);
      const resBody = response.body;

      const result = await WorkPosition.findOne(newWorkPosition);

      expect(response.statusCode).toBe(201);
      expect(result.positionName).toBe(newWorkPosition.positionName);
      expect(resBody.data._id).toBeTruthy();
    });

    test("should fail to create new work position when missing params", async () => {
      const response = await request(app).post(route);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe(`GET ${route}`, () => {
    test("should find all work position", async () => {
      const response = await request(app).get(route);
      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data.length).toBe(5);
    });

    test("should fail to find work position if non exist", async () => {
      // Empty production line collection to force fail to find
      await WorkPosition.deleteMany();

      const response = await request(app).get(route);
      const resBody = response.body;

      expect(response.statusCode).toBe(404);
      expect(resBody.message).toContain("Error");
    });
  });

  describe(`GET ${route}:_id`, () => {
    test("should find work position matching given id", async () => {
      const workPosition = await WorkPosition.findOne();

      const response = await request(app).get(`${route}${workPosition.id}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(200);
      expect(resBody.data[0].positionName).toBe(workPosition.positionName);
    });

    test("should fail to find work positions if invalid id provided", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app).get(`${route}${query}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe(`PATCH ${route}/:_id`, () => {
    const params = { positionName: "Robot Welder" };

    test("should successfully update work position document", async () => {
      const workPosition = await WorkPosition.findOne();

      const response = await request(app)
        .patch(`${route}${workPosition.id}`)
        .send(params);

      const result = await WorkPosition.findOne({ _id: workPosition.id });

      expect(response.statusCode).toBe(200);
      expect(result.positionName).toBe(params.positionName);
    });

    test("should fail to update work position document if params not provided", async () => {
      const workPosition = await WorkPosition.findOne();

      const response = await request(app)
        .patch(`${route}${workPosition.id}`)
        .send();
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });

    test("should fail to update work position document if invalid id provided", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`${route}${query}`)
        .send(params);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });

  describe(`DELETE ${route}:_id`, () => {
    test("should successfully delete department", async () => {
      const workPosition = await WorkPosition.findOne();

      const response = await request(app).delete(`${route}${workPosition.id}`);

      const result = await WorkPosition.findOne({ _id: workPosition.id });

      expect(response.statusCode).toBe(200);
      expect(result).toBe(null);
    });

    test("should fail to delete work position if id not found", async () => {
      const query = new mongoose.Types.ObjectId();

      const response = await request(app).delete(`${route}${query}`);
      const resBody = response.body;

      expect(response.statusCode).toBe(400);
      expect(resBody.message).toContain("Validation Error");
    });
  });
});
