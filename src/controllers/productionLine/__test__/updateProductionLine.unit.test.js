import updateProductionLine from "../updateProductionLine.js";
import findDocumentById from "#controllers/utils/findDocumentById.js";
import updateDocument from "#controllers/utils/updateDocument.js";
import saveDocument from "#controllers/utils/saveDocument.js";
import ProductionLine from "#models/productionLine.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

vi.mock("#controllers/utils/findDocumentById.js", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/updateDocument.js", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/saveDocument.js", () => ({ default: vi.fn() }));
vi.mock("#responses/response.js", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Update production line controller", () => {
  const mockProductionLine = {
    _id: "line id",
    lineName: "test line",
    department: "old department id",
  };

  const mockOldDepartment = {
    _id: "old department id",
    departmentName: "old department",
    productionLines: {
      push: vi.fn(),
      pull: vi.fn(),
    },
  };

  const mockNewDepartment = {
    _id: "old department id",
    departmentName: "old department",
    productionLines: {
      push: vi.fn(),
      pull: vi.fn(),
    },
  };

  mockReq = {
    params: { departmentId: "department id", _id: "production line id" },
    body: { lineName: "new line name", department: "new department id" },
    session: {},
  };

  const mockSuccessResponse = {
    success: true,
    message: "success message",
    data: "test data",
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    message: "unsuccessful message",
    data: null,
    error: "test data",
  };

  test("should return success response when successful", async () => {
    findDocumentById
      .mockResolvedValue(mockSuccessResponse)
      .mockResolvedValueOnce({
        ...mockSuccessResponse,
        data: mockProductionLine,
      })
      .mockResolvedValueOnce({
        ...mockSuccessResponse,
        data: mockOldDepartment,
      })
      .mockResolvedValueOnce({
        ...mockSuccessResponse,
        data: mockNewDepartment,
      });

    const params = { ...mockReq.body };
    const updateProductionLinesResult = { ...mockProductionLine, ...params };
    updateDocument.mockResolvedValue(updateProductionLinesResult);

    saveDocument
      .mockResolvedValue(mockSuccessResponse)
      .mockResolvedValueOnce({
        ...mockSuccessResponse,
        data: mockProductionLine,
      })
      .mockResolvedValueOnce({
        ...mockSuccessResponse,
        data: mockOldDepartment,
      })
      .mockResolvedValueOnce({
        ...mockSuccessResponse,
        data: mockNewDepartment,
      });

    await updateProductionLine(mockReq, mockRes, mockNext);

    expect(findDocumentById).toHaveBeenNthCalledWith(
      1,
      ProductionLine,
      mockReq.params._id,
    );
    expect(updateDocument).toHaveBeenNthCalledWith(
      1,
      mockProductionLine,
      params,
    );
    expect(saveDocument).toHaveBeenNthCalledWith(
      1,
      updateProductionLinesResult,
      mockReq.session,
    );
    expect(findDocumentById).toHaveBeenNthCalledWith(
      2,
      Department,
      mockReq.params.departmentId,
    );
    expect(mockOldDepartment.productionLines.pull).toBeCalledWith(
      mockProductionLine,
    );
    expect(saveDocument).toHaveBeenNthCalledWith(
      2,
      mockOldDepartment,
      mockReq.session,
    );
    expect(findDocumentById).toHaveBeenNthCalledWith(
      3,
      Department,
      mockReq.body.department,
    );
    expect(mockNewDepartment.productionLines.push).toBeCalledWith(
      mockProductionLine,
    );
    expect(saveDocument).toHaveBeenNthCalledWith(
      3,
      mockNewDepartment,
      mockReq.session,
    );
    expect(mockRes.status).toBeCalled();
    expect(successResponse).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });

  test("should handle unexpected errors", async () => {
    findDocumentById.mockRejectedValueOnce(
      new Error("Failed to find document"),
    );

    await updateProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
