import readProductionLine from "../readProductionLine.js";
import readDocument from "#controllers/utils/readDocument.js";
import AppError from "#utils/appError.js";

// Mock readDocument function
vi.mock("#controllers/utils/readDocument.js", () => ({ default: vi.fn() }));

describe("Read productionLine controller", () => {
  // Setup test variables
  const mockReadDocumentSuccess = {
    success: true,
    message: "test message",
    data: [{ lineName: "test" }],
    error: null,
  };

  const mockReadDocumentError = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  test("should return success response when successful", async () => {
    // Mock return value for successful operation
    readDocument.mockResolvedValueOnce(mockReadDocumentSuccess);

    await readProductionLine(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next when unsuccessful", async () => {
    // Mock return value for failed operation
    readDocument.mockRejectedValueOnce(mockReadDocumentError);

    await readProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });

  test("should pass error to next when no data found", async () => {
    // Mock return value for successful operation with no returned results
    readDocument.mockRejectedValueOnce({
      ...mockReadDocumentSuccess,
      data: [],
    });

    await readProductionLine(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
