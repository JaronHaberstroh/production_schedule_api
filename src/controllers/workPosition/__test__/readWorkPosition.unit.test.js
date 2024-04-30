import readWorkPosition from "../readWorkPosition.js";
import readDocument from "#controllers/utils/readDocument.js";
import AppError from "#utils/appError.js";

vi.mock("#controllers/utils/readDocument.js", () => ({ default: vi.fn() }));

describe("Read work position controller", () => {
  const mockReadDocumentSuccess = {
    success: true,
    message: "test message",
    data: { positionName: "test" },
    error: null,
  };

  const mockReadDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  test("should return success response when successful", async () => {
    readDocument.mockResolvedValueOnce(mockReadDocumentSuccess);

    await readWorkPosition(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    readDocument.mockRejectedValueOnce(mockReadDocumentError);

    await readWorkPosition(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should pass error to next if no data found", async () => {
    readDocument.mockRejectedValueOnce({
      ...mockReadDocumentSuccess,
      data: [],
    });

    await readWorkPosition(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
