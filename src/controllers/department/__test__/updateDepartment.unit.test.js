import updateDepartment from "../updateDepartment.js";
import findDocumentById from "#controllers/utils/findDocumentById.js";
import updateDocument from "#controllers/utils/updateDocument.js";
import saveDocument from "#controllers/utils/saveDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

vi.mock("#controllers/utils/findDocumentById.js", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/updateDocument.js", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/saveDocument.js", () => ({ default: vi.fn() }));
vi.mock("#responses/response", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Update department controller", () => {
  const mockSuccessResponse = {
    success: true,
    message: "test message",
    data: { departmentName: "test" },
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    message: "fail message",
    data: null,
    error: new AppError(),
  };

  mockReq = {
    params: { _id: "test id" },
    body: { name: "updatedName" },
  };

  test("should find document", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await updateDepartment(mockReq, mockRes, mockNext);

    expect(findDocumentById).toBeCalledWith(Department, mockReq.params._id);
  });

  test("should pass error to next if document not found", async () => {
    findDocumentById.mockResolvedValueOnce(mockErrorResponse);

    await updateDepartment(mockReq, mockRes, mockNext);

    expect(findDocumentById).toBeCalled();
    expect(updateDocument).not.toBeCalled();
    expect(saveDocument).not.toBeCalled();
    expect(mockNext).toBeCalled();
  });

  test("should update document", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await updateDepartment(mockReq, mockRes, mockNext);

    expect(updateDocument).toBeCalledWith(
      mockSuccessResponse.data,
      mockReq.body,
    );
  });

  test("should save document", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    updateDocument.mockResolvedValue("document");

    await updateDepartment(mockReq, mockRes, mockNext);

    expect(saveDocument).toBeCalledWith("document");
  });

  test("should return success response when successful", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    await updateDepartment(mockReq, mockRes, mockNext);

    expect(successResponse).toBeCalled();
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    saveDocument.mockRejectedValueOnce(mockErrorResponse);

    await updateDepartment(mockReq, mockRes, mockNext);

    await expect(mockNext).toBeCalledWith(expect.any(AppError));
    expect(mockRes.status).not.toBeCalled();
    expect(mockRes.json).not.toBeCalled();
  });
});
