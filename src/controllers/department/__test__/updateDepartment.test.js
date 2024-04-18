// @vitest-environment express

import updateDepartment from "../updateDepartment.js";
import updateDocumment from "#controllers/utils/updateDocument.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";

// Mock updateDocument function
vi.mock("#controllers/utils/updateDocument.js", () => ({ default: vi.fn() }));

describe("Update department controller", () => {
  // Setup test Variables
  const mockUpdateDocumentSuccess = {
    success: true,
    message: "test message",
    data: { departmentName: "test" },
    error: null,
  };

  const mockUpdateDocumentError = {
    success: false,
    message: "fail message",
    data: null,
    error: new AppError(),
  };

  beforeAll(() => {
    mockReq.body = { departmentName: "testDepartment" };
    mockReq.params = { _id: new mongoose.Types.ObjectId() };
  });

  beforeEach(() => {
    // Reset test variables
    mockReq.body = { departmentName: "testDepartment" };
    mockReq.params = { _id: new mongoose.Types.ObjectId() };
  });

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    updateDocumment.mockResolvedValue(mockUpdateDocumentSuccess);

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    // Mock return value for unsuccessful operation
    updateDocumment.mockResolvedValue(mockUpdateDocumentError);

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    await expect(mockNext).toBeCalledWith(
      new AppError(
        `Error while updating Department document: ${mockUpdateDocumentError.message}`
      )
    );
  });

  test("should pass error to next if _id not provided", async () => {
    // Alter _id to simulate missing _id param
    mockReq.params._id = "";

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(new AppError("Department id is required"));
  });

  test("should pass error to next if params not provided", async () => {
    // Alter body to simulate missing body params
    mockReq.body = "";

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(
      new AppError("Update requires changed properties be provided")
    );
  });
});
