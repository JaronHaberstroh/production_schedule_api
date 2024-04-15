// @vitest-environment express

import updateDocumment from "#controllers/utils/updateDocument.js";
import AppError from "#utils/appError.js";
import updateDepartment from "../updateDepartment.js";

const returnValues = {
  success: true,
  message: "failed message",
};

vi.mock("#controllers/utils/updateDocument.js", () => {
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

describe("update department controller", () => {
  let testData;
  beforeAll(() => {
    // Set test variables
    testData = { _id: "testing", departmentName: "test Department" };
    mockReq = {
      body: { departmentName: testData.departmentName },
      params: { _id: testData._id },
    };
  });

  beforeEach(() => {
    // Reset test variables
    mockReq.body = { departmentName: testData.departmentName };
    mockReq.params = { _id: testData._id };
  });

  test("should return success response when successful", async () => {
    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should throw error if _id not provided", async () => {
    // Alter test variables to force error
    mockReq.params._id = "";

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect Error be thrown
    expect(mockNext).toBeCalledWith(
      new AppError("Failed to update document: Department id is required", 404)
    );
  });

  test("should throw error if params not provided", async () => {
    // Alter test variables to force error
    mockReq.body = "";

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be thrown
    expect(mockNext).toBeCalledWith(
      new AppError(
        "Failed to update document: Update requires changed properties be provided",
        404
      )
    );
  });

  test("should throw error when success false", async () => {
    // Alter test variables to force error
    updateDocumment.mockReturnValue({
      ...returnValues,
      success: false,
    });

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be thrown
    await expect(mockNext).toBeCalledWith(
      new AppError(
        "Failed to update document: Document was not updated successfully: failed message",
        500
      )
    );
  });
});
