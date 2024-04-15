// @vitest-environment express

import readDocument from "#controllers/utils/readDocument.js";
import AppError from "#utils/appError.js";
import readDepartment from "../readDepartment.js";

const returnValues = {
  success: true,
  message: "failed message",
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
    await readDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next if success false", async () => {
    // Mock return value
    readDocument.mockReturnValue({
      ...returnValues,
      success: false,
    });

    // Call read department controller
    await readDepartment(mockReq, mockRes, mockNext);

    // Expect next to have been called with error object
    expect(mockNext).toBeCalledWith(
      new AppError(
        `Failed to find departments: Unable to find departments: ${returnValues.message}`,
        500
      )
    );
  });

  test("should pass error to next if no data found", async () => {
    // Mock return value
    readDocument.mockReturnValue({
      ...returnValues,
      data: [],
    });

    // Call read department controller
    await readDepartment(mockReq, mockRes, mockNext);

    // Expect next to have been called with error object
    expect(mockNext).toBeCalledWith(
      new AppError(
        "Failed to find departments: No data returned from search:",
        500
      )
    );
  });
});
