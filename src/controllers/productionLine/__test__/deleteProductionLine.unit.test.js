import deleteProductionLine from "../deleteProductionLine";
import findDocumentById from "#controllers/utils/findDocumentById";
import deleteDocument from "#controllers/utils/deleteDocument";
import saveDocument from "#controllers/utils/saveDocument";
import ProductionLine from "#models/productionLine";
import Department from "#models/department";
import AppError from "#utils/appError";
import { successResponse } from "#responses/response";

vi.mock("#controllers/utils/findDocumentById", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/deleteDocument", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/saveDocument", () => ({ default: vi.fn() }));
vi.mock("#responses/response", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Delete productionLine controller", () => {
  mockReq = {
    params: {
      departmentId: "test department id",
      _id: "test production line id",
    },
    session: {},
  };

  const mockDepartment = {
    id: mockReq.params.departmentId,
    departmentName: "department name",
    productionLines: { pull: vi.fn() },
  };

  const mockSuccessResponse = {
    success: true,
    message: "successful message",
    data: mockDepartment,
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    message: "unsuccessful message",
    data: null,
    error: new AppError("unsuccessful message", 500),
  };

  test("should find department document", async () => {
    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(findDocumentById).toBeCalledWith(
      Department,
      mockReq.params.departmentId,
    );
  });

  test("should pass error to next if department not found", async () => {
    findDocumentById.mockResolvedValueOnce(mockErrorResponse);

    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(findDocumentById).toBeCalled();
    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should push production line id into department.productionLines list", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(mockDepartment.productionLines.pull).toBeCalledWith(
      mockReq.params._id,
    );
  });

  test("should save department", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(saveDocument).toBeCalledWith(mockDepartment, mockReq.session);
  });

  test("should pass error to next if failed to save department document", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    saveDocument.mockResolvedValueOnce(mockErrorResponse);

    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should delete production line", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(deleteDocument).toBeCalledWith(
      ProductionLine,
      mockReq.params._id,
      mockReq.session,
    );
  });

  test("should pass error to next if failed to delete production line", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    deleteDocument.mockResolvedValueOnce(mockErrorResponse);

    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should return successful response when successful", async () => {
    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    deleteDocument.mockResolvedValueOnce(mockSuccessResponse);

    await deleteProductionLine(mockReq, mockRes, mockNext);

    expect(successResponse).toBeCalled();
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });
});
