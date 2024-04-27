import updateDepartment from "../updateDepartment.js";
import updateDocumment from "#controllers/utils/updateDocument.js";
import AppError from "#utils/appError.js";

// Mock updateDocument function
vi.mock("#controllers/utils/updateDocument.js", () => ({ default: vi.fn() }));

describe("Update department controller", () => {
  // Setup test Variables
  const mockUpdateDocumentSuccess = {
    success: true,
    message: "test message",
    data: { departmentName: "test" },
    error: null,
  };

  const mockUpdateDocumentError = {
    success: false,
    message: "fail message",
    data: null,
    error: new AppError(),
  };

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    updateDocumment.mockResolvedValue(mockUpdateDocumentSuccess);

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect response to have been called
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    // Mock return value for unsuccessful operation
    updateDocumment.mockRejectedValueOnce(mockUpdateDocumentError);

    // Call update department controller
    await updateDepartment(mockReq, mockRes, mockNext);

    // Expect Error to be passed to next
    await expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
