import createDepartment from "../createDepartment.js";
import createDocument from "#controllers/utils/createDocument.js";
import AppError from "#utils/appError.js";

// Mock createDocument function
vi.mock("#controllers/utils/createDocument.js", () => ({ default: vi.fn() }));

describe("Create department controller", () => {
  // Setup test variables
  const mockCreateDocumentSuccess = {
    success: true,
    message: "test message",
    data: { departmentName: "testDepartment" },
    error: null,
  };

  const mockCreateDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    createDocument.mockResolvedValueOnce(mockCreateDocumentSuccess);

    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    // Mock return value for failed operation
    createDocument.mockRejectedValueOnce(mockCreateDocumentError);

    // Call create department controller
    await createDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
