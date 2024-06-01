import readDepartment from "../readDepartment.js";
import findDocuments from "#controllers/utils/findDocuments.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

vi.mock("#controllers/utils/findDocuments.js", () => ({ default: vi.fn() }));
vi.mock("#responses/response.js", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Read department controller", () => {
  const mockReadDocumentSuccess = {
    success: true,
    message: "test message",
    data: { departmentName: "test" },
    error: null,
  };

  const mockReadDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  test("should find documents", async () => {
    findDocuments.mockResolvedValueOnce(mockReadDocumentSuccess);

    await readDepartment(mockReq, mockRes, mockNext);

    expect(findDocuments).toBeCalledWith(Department, {});
  });

  test("should return success response when successful", async () => {
    findDocuments.mockResolvedValueOnce(mockReadDocumentSuccess);

    await readDepartment(mockReq, mockRes, mockNext);

    expect(successResponse).toBeCalled();
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });

  test("should pass error to next if no data found", async () => {
    findDocuments.mockResolvedValueOnce({
      ...mockReadDocumentSuccess,
      data: [],
    });

    await readDepartment(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should pass error to next when unsuccessful", async () => {
    findDocuments.mockRejectedValueOnce(mockReadDocumentError);

    await readDepartment(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
    expect(mockRes.status).not.toBeCalled();
    expect(mockRes.json).not.toBeCalled();
  });
});
