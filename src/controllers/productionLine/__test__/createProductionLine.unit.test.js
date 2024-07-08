import createProductionLine from "../createProductionLine.js";
import findDocumentById from "#controllers/utils/findDocumentById.js";
import createDocument from "#controllers/utils/createDocument.js";
import saveDocument from "#controllers/utils/saveDocument.js";
import ProductionLine from "#models/productionLine.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

vi.mock("#controllers/utils/findDocumentById.js", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/createDocument.js", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/saveDocument.js", () => ({ default: vi.fn() }));
vi.mock("#responses/response", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Create productionLine controller", () => {
  mockReq = {
    params: { departmentId: "test department id" },
    body: { lineName: "test line" },
    session: {},
  };

  const mockProductionLine = {
    id: "test id",
    lineName: "test line",
    workPositions: [],
  };

  const mockDepartment = {
    departmentName: "test department",
    productionLines: {
      push: vi.fn(),
    },
  };

  const mockSuccessResponse = {
    success: true,
    message: "success message",
    data: { ...mockDepartment },
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    message: "failure message",
    data: "test data",
    error: new AppError("Error message", 500),
  };

  test("should create new productionLine", async () => {
    await createProductionLine(mockReq, mockRes, mockNext);

    expect(createDocument).toBeCalledWith(ProductionLine, mockReq.body);
  });

  test("should save new productionLine", async () => {
    createDocument.mockReturnValueOnce(mockProductionLine);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(saveDocument).toBeCalledWith(mockProductionLine, mockReq.session);
  });

  test("should pass error to next if save production line is unsuccessful", async () => {
    saveDocument.mockRejectedValueOnce(mockErrorResponse);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
    expect(findDocumentById).not.toBeCalled();
  });

  test("should find department document", async () => {
    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(findDocumentById).toBeCalledWith(
      Department,
      mockReq.params.departmentId,
    );
  });

  test("should pass error to next if department document not found", async () => {
    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    findDocumentById.mockRejectedValueOnce(mockErrorResponse);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(findDocumentById).toBeCalled();
    expect(mockNext).toBeCalledWith(expect.any(AppError));
    expect(saveDocument).not.toBeCalledTimes(2);
  });

  test("should push productionLine document into department.productionLines list", async () => {
    createDocument.mockReturnValueOnce(mockProductionLine);

    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(mockDepartment.productionLines.push).toBeCalledWith(
      mockProductionLine,
    );
  });

  test("should save department document", async () => {
    createDocument.mockReturnValueOnce(mockProductionLine);

    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(saveDocument).toHaveBeenNthCalledWith(
      2,
      mockDepartment,
      mockReq.session,
    );
  });

  test("should pass error to next if save department document is unsuccessful", async () => {
    createDocument.mockReturnValueOnce(mockProductionLine);

    saveDocument
      .mockResolvedValue(mockSuccessResponse)
      .mockResolvedValueOnce(mockSuccessResponse)
      .mockRejectedValueOnce(mockErrorResponse);

    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(saveDocument).toBeCalledTimes(2);
    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should return success response when successful", async () => {
    createDocument.mockReturnValueOnce(mockProductionLine);

    saveDocument.mockResolvedValue(mockSuccessResponse);

    findDocumentById.mockResolvedValueOnce(mockSuccessResponse);

    await createProductionLine(mockReq, mockRes, mockNext);

    expect(createDocument).toBeCalled();
    expect(findDocumentById).toBeCalled();
    expect(mockDepartment.productionLines.push).toBeCalled();
    expect(saveDocument).toBeCalledTimes(2);
    expect(successResponse).toBeCalled();
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });
});
