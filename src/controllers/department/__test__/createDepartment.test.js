// @vitest-environment express

import createDepartment from "#controllers/department/createDepartment.js";
import createDocument from "#controllers/utils/createDocument.js";
import AppError from "#utils/appError.js";

// Mock create document function
vi.mock("#controllers/utils/createDocument.js", () => {
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

describe("Create department controller", () => {
  let testData;
  beforeAll(() => {
    // Set test variables
    testData = { departmentName: "testDepartment" };
    mockReq = { body: testData };
  });

  beforeEach(() => {
    // Reset departmentName variable
    mockReq.body.departmentName = "testDepartment";
  });

  test("should return success response when successful", async () => {
    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should throw error when no departmentName given", async () => {
    // Alter department name to force test fail
    mockReq.body.departmentName = null;

    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be thrown
    expect(mockNext).toBeCalledWith(
      new AppError(
        "Unable to save Department: Department name is required",
        400
      )
    );
  });

  test("should throw error if success is false", async () => {
    // Mock return value
    createDocument.mockReturnValue({
      success: false,
      message: "failed message",
    });

    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be thrown
    expect(mockNext).toBeCalledWith(
      new AppError(
        `Unable to save Department: Failed to create document: failed message`,
        500
      )
    );
  });
});
