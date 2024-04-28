import createProductionLine from "../createProductionLine.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";

describe("Create productionLine controller", () => {
  let department;
  beforeAll(async () => {
    department = new Department({
      departmentName: "Test Department",
    });
    await department.save();
  });

  beforeEach(async () => {
    mockReq = {
      params: { departmentId: department._id },
      body: { lineName: "Test Line" },
      session: await mongoose.startSession(),
    };
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
