// @vitest-environment express

import deleteDepartment from "../deleteDepartment.js";
import deleteDocument from "#controllers/utils/deleteDocument.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";

// Mock deleteDocument function
vi.mock("#controllers/utils/deleteDocument.js", () => ({ default: vi.fn() }));

describe("Delete department controller", () => {
  // Setup test variables
  const mockDeleteDocumentSuccess = {
    success: true,
    message: "test message",
    data: { departmentName: "testDepartment" },
    error: null,
  };

  const mockDeleteDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  beforeAll(() => {
    mockReq.params = { _id: new mongoose.Types.ObjectId() };
  });

  beforeEach(() => {
    // Reset test variables
    mockReq.params._id = new mongoose.Types.ObjectId();
  });

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    deleteDocument.mockResolvedValue(mockDeleteDocumentSuccess);

    // Call delete department controller
    await deleteDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    // Mock return value for failed operation
    deleteDocument.mockReturnValue(mockDeleteDocumentError);

    // Call delete department controller
    await deleteDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(
      new AppError(
        `Error while deleting Department document: ${mockDeleteDocumentError.message}`
      )
    );
  });
});
