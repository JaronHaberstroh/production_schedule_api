// @vitest-environment express

import deleteDepartment from "../deleteDepartment.js";
import deleteDocument from "#controllers/utils/deleteDocument.js";
import AppError from "#utils/appError.js";

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
    mockReq.params = { _id: testData._id };
  });

  beforeEach(() => {
    // Reset test variables
    mockReq.params._id = testData._id;
  });

  test("should return success response when successful", async () => {
    // Call delete department controller
    await deleteDepartment(mockReq, mockRes);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should throw error if _id not provided", async () => {
    // Alter _id to force test fail
    mockReq.params._id = null;

    // Expect Error to be thrown
    await expect(deleteDepartment(mockReq, mockRes)).rejects.toThrowError(
      new AppError("Department _id is required", 400)
    );
  });

  test("should throw error if success is false", async () => {
    // Mock return value
    deleteDocument.mockReturnValue({
      success: false,
      error: { message: "failed message" },
    });

    // Expect Error to be thrown
    await expect(deleteDepartment(mockReq, mockRes)).rejects.toThrowError(
      new AppError("Failed to delete Department: failed message", 500)
    );
  });
});
