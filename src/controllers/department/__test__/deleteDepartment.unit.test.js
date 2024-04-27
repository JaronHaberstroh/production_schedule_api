import deleteDepartment from "../deleteDepartment.js";
import deleteDocument from "#controllers/utils/deleteDocument.js";
import AppError from "#utils/appError.js";

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

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    deleteDocument.mockResolvedValueOnce(mockDeleteDocumentSuccess);

    // Call delete department controller
    await deleteDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    // Mock return value for failed operation
    deleteDocument.mockRejectedValueOnce(mockDeleteDocumentError);

    // Call delete department controller
    await deleteDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
