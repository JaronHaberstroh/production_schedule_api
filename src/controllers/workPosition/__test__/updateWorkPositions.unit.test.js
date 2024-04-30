import updateWorkPosition from "../updateWorkPositions.js";
import updateDocumment from "#controllers/utils/updateDocument.js";
import AppError from "#utils/appError.js";

vi.mock("#controllers/utils/updateDocument.js", () => ({ default: vi.fn() }));

describe("Update work position controller", () => {
  const mockUpdateDocumentSuccess = {
    success: true,
    message: "test message",
    data: { positionName: "test" },
    error: null,
  };

  const mockUpdateDocumentError = {
    success: false,
    message: "fail message",
    data: null,
    error: new AppError(),
  };

  test("should return success response when successful", async () => {
    updateDocumment.mockResolvedValue(mockUpdateDocumentSuccess);

    await updateWorkPosition(mockReq, mockRes, mockNext);

    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    updateDocumment.mockRejectedValueOnce(mockUpdateDocumentError);

    await updateWorkPosition(mockReq, mockRes, mockNext);

    await expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
