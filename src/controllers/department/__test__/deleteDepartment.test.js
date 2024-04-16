// @vitest-environment express

import deleteDepartment from "../deleteDepartment.js";
import deleteDocument from "#controllers/utils/deleteDocument.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";

vi.mock("#controllers/utils/deleteDocument.js", () => {
  return {
    default: vi.fn((model, data) => {
      return {
        success: true,
        model,
        data,
      };
    }),
  };
});

describe("delete department controller", () => {
  let testData;
  beforeAll(() => {
    testData = { _id: "testing", departmentName: "test department" };
    mockReq.params = { _id: new mongoose.Types.ObjectId() };
  });

  beforeEach(() => {
    // Reset test variables
    mockReq.params._id = new mongoose.Types.ObjectId();
  });

  test("should return success response when successful", async () => {
    // Call delete department controller
    await deleteDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should throw error if _id not provided", async () => {
    // Alter _id to force test fail
    mockReq.params._id = null;

    // Call delete department controller
    await deleteDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be thrown
    expect(mockNext).toBeCalledWith(
      new AppError(
        "Failed to delete Department: Department _id is required",
        400
      )
    );
  });

  test("should throw error if success is false", async () => {
    // Mock return value
    deleteDocument.mockReturnValue({
      success: false,
      message: "failed message",
    });

    // Call delete department controller
    await deleteDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be thrown
    expect(mockNext).toBeCalledWith(
      new AppError(
        "Failed to delete Department: Unable to delete Department: failed message",
        500
      )
    );
  });
});
