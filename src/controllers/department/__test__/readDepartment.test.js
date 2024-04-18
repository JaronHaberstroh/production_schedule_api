// @vitest-environment express

import readDepartment from "../readDepartment.js";
import readDocument from "#controllers/utils/readDocument.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";

// Mock readDocument function
vi.mock("#controllers/utils/readDocument.js", () => ({ default: vi.fn() }));

describe("Read department controller", () => {
  // Setup test variables
  const mockReadDocumentSuccess = {
    success: true,
    message: "test message",
    data: { departmentName: "test" },
    error: null,
  };

  const mockReadDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };
  beforeAll(() => {
    mockReq.params = { _id: new mongoose.Types.ObjectId() };
  });

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    readDocument.mockResolvedValue(mockReadDocumentSuccess);

    // Call read department controller
    await readDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    // Mock return value for failed operation
    readDocument.mockResolvedValue(mockReadDocumentError);

    // Call read department controller
    await readDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(
      new AppError(
        `Error while fetching Department data: ${mockReadDocumentError.message}`
      )
    );
  });

  test("should pass error to next if no data found", async () => {
    // Mock return value for successful operation with no returned results
    readDocument.mockResolvedValue({ ...mockReadDocumentSuccess, data: [] });

    // Call read department controller
    await readDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(
      new AppError("No data returned from search:")
    );
  });
});
