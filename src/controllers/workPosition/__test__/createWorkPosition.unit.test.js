import createWorkPosition from "../createWorkPosition.js";
import createDocument from "#controllers/utils/createDocument.js";
import AppError from "#utils/appError.js";

vi.mock("#controllers/utils/createDocument.js", () => ({ default: vi.fn() }));

describe("Create work position controller", () => {
  const mockCreateDocumentSuccess = {
    success: true,
    message: "test message",
    data: { positionName: "test position" },
    error: null,
  };

  const mockCreateDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  test("should return success response when successful", async () => {
    createDocument.mockResolvedValueOnce(mockCreateDocumentSuccess);

    await createWorkPosition(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    createDocument.mockRejectedValueOnce(mockCreateDocumentError);

    await createWorkPosition(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
