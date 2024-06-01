import deleteDepartment from "../deleteDepartment.js";
import deleteDocument from "#controllers/utils/deleteDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

// Mock deleteDocument function
vi.mock("#controllers/utils/deleteDocument.js", () => ({ default: vi.fn() }));
vi.mock("#responses/response.js", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Delete department controller", () => {
  const mockSuccessResponse = {
    success: true,
    message: "test message",
    data: { departmentName: "testDepartment" },
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  const testId = "test id";
  mockReq.params._id = testId;

  test("should delete document", async () => {
    deleteDocument.mockResolvedValueOnce(mockSuccessResponse);

    await deleteDepartment(mockReq, mockRes, mockNext);

    expect(deleteDocument).toBeCalledWith(Department, { _id: testId });
  });

  test("should return success response when successful", async () => {
    deleteDocument.mockResolvedValueOnce(mockSuccessResponse);

    await deleteDepartment(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    deleteDocument.mockRejectedValueOnce(mockErrorResponse);

    await deleteDepartment(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
    expect(mockRes.status).not.toBeCalled();
    expect(mockRes.json).not.toBeCalled();
  });
});
