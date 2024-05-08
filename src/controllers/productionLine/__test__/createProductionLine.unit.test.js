import createProductionLine from "../createProductionLine.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "#utils/mongoDB/mongooseSetup.js";

describe("Create productionLine controller", () => {
  let mongoConnection, mongoReplSet;

  let department;
  beforeAll(async () => {
    ({ mongoConnection, mongoReplSet } = await connectDB());

    department = new Department({
      departmentName: "Test Department",
    });
    await department.save();
  });

  beforeEach(async () => {
    mockReq = {
      params: { departmentId: department.id },
      body: { lineName: "Test Line" },
      session: await mongoose.startSession(),
    };
  });

  afterAll(async () => {
    await disconnectDB(mongoConnection, mongoReplSet);
  });

  test("should return success response when successful", async () => {
    await createProductionLine(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalledWith(201);
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    mockReq.session = {};

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
