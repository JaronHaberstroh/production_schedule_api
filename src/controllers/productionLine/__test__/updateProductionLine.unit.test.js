import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";
import updateProductionLine from "../updateProductionLine.js";
import { connectDB, disconnectDB } from "#utils/mongoDB/mongooseSetup.js";

describe("Update production line controller", () => {
  let mongoConnection, mongoReplSet;

  let department, productionLine;
  beforeAll(async () => {
    ({ mongoConnection, mongoReplSet } = await connectDB());

    department = new Department({
      departmentName: "Test Department",
      productionLines: [],
    });

    productionLine = new ProductionLine({
      lineName: "Test Line",
      department: department.id,
    });

    department.productionLines.push(productionLine);

    await department.save();
    await productionLine.save();
  });

  beforeEach(async () => {
    mockReq = {
      params: { departmentId: department.id, _id: productionLine.id },
      body: { lineName: "New Test Line Name" },
      session: await mongoose.startSession(),
    };
  });

  afterAll(async () => {
    await disconnectDB(mongoConnection, mongoReplSet);
  });

  test("should return success response when successful", async () => {
    await updateProductionLine(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    mockReq.session = {};

    await updateProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
