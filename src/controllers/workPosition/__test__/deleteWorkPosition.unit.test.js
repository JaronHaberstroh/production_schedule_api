import deleteWorkPosition from "../deleteWorkPosition.js";
import deleteDocument from "#controllers/utils/deleteDocument.js";
import AppError from "#utils/appError.js";

vi.mock("#controllers/utils/deleteDocument.js", () => ({ default: vi.fn() }));

describe("Delete department controller", () => {
  const mockDeleteDocumentSuccess = {
    success: true,
    message: "test message",
    data: { positionName: "test position" },
    error: null,
  };

  const mockDeleteDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  test("should return success response when successful", async () => {
    deleteDocument.mockResolvedValueOnce(mockDeleteDocumentSuccess);

    await deleteWorkPosition(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    deleteDocument.mockRejectedValueOnce(mockDeleteDocumentError);

    await deleteWorkPosition(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
