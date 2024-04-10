// @vitest-environment express

import readDocument from "#controllers/utils/readDocument.js";
import AppError from "#utils/appError.js";
import readDepartment from "../readDepartment.js";

const returnValues = {
  success: true,
  error: { message: "failed message" },
};

// Mock read document function
vi.mock("#controllers/utils/readDocument.js", () => {
  return {
    default: vi.fn((model, data) => {
      return {
        ...returnValues,
        model,
        data,
      };
    }),
  };
});

describe("read department controller", () => {
  let testData;
  beforeAll(() => {
    // Set test variables
    testData = { _id: "testing", departmentName: "test department" };
    mockReq.params = { _id: testData._id };
  });

  beforeEach(() => {
    // Reset test variables
  });

  test("should return success response when successful", async () => {
    // Call read department controller
    await readDepartment(mockReq, mockRes);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should throw error if success is false", async () => {
    // Mock return value
    readDocument.mockReturnValue({
      ...returnValues,
      success: false,
    });

    // Expect Error to be thrown
    await expect(readDepartment(mockReq, mockRes)).rejects.toThrowError(
      new AppError("Failed to find departments: failed message", 500)
    );
  });

  test("should throw error if no data is found", async () => {
    // Mock return value
    readDocument.mockReturnValue({
      ...returnValues,
      data: null,
    });

    // Expect Error to be thrown
    await expect(readDepartment(mockReq, mockRes)).rejects.toThrowError(
      new AppError("No data returned for search: Error", 500)
    );
  });
});
