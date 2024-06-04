import readProductionLine from "../readProductionLine.js";
import findDocuments from "#controllers/utils/findDocuments.js";
import ProductionLine from "#models/productionLine.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

vi.mock("#controllers/utils/findDocuments.js", () => ({ default: vi.fn() }));
vi.mock("#responses/response.js", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Read productionLine controller", () => {
  mockReq = {
    params: {
      _id: "test productionLine id",
      departmentId: "test departmentId",
    },
  };

  const mockSuccessResponse = {
    success: true,
    message: "test message",
    data: "test data",
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError("error message", 500),
  };

  test("should find prouction lines", async () => {
    const params = {
      department: mockReq.params.departmentId,
      _id: mockReq.params._id,
    };

    findDocuments.mockResolvedValueOnce(mockSuccessResponse);

    await readProductionLine(mockReq, mockRes, mockNext);

    expect(findDocuments).toBeCalledWith(ProductionLine, params);
  });

  test("should pass error to next when find lines unsuccessful", async () => {
    findDocuments.mockResolvedValueOnce(mockErrorResponse);

    await readProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should return success response when successful", async () => {
    findDocuments.mockResolvedValueOnce(mockSuccessResponse);

    await readProductionLine(mockReq, mockRes, mockNext);

    expect(successResponse).toBeCalled();
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    findDocuments.mockRejectedValue(mockErrorResponse);

    await readProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
