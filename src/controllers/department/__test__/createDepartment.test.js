// @vitest-environment express

import createDepartment from "../createDepartment.js";
import createDocument from "#controllers/utils/createDocument.js";
import AppError from "#utils/appError.js";

// Mock createDocument function
vi.mock("#controllers/utils/createDocument.js", () => ({ default: vi.fn() }));

describe("Create department controller", () => {
  // Setup test variables
  const testData = { departmentName: "testDepartment" };

  const mockCreateDocumentSuccess = {
    success: true,
    message: "test message",
    data: { ...testData },
    error: null,
  };

  const mockCreateDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  beforeAll(() => {
    // Set test variables
    mockReq = { body: { ...testData } };
  });
  beforeEach(() => {
    // Reset test variables
    mockReq.body.departmentName = testData.departmentName;
  });

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    createDocument.mockResolvedValue(mockCreateDocumentSuccess);

    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    // Mock return value for failed operation
    createDocument.mockResolvedValue(mockCreateDocumentError);

    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(
      new AppError(
        `Error while saving Department document: ${mockCreateDocumentError.message}`
      )
    );
  });

  test("should pass error to next when no departmentName given", async () => {
    // Alter department name to force test fail
    mockReq.body.departmentName = null;

    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(
      new AppError("Department name is required")
    );
  });
});
