import { successResponse } from "#responses/response";
import AppError from "#utils/appError";
import handleCrudOpResult from "../handleCrudOpResult";

describe("handleCrudOpResult()", () => {
  const mockSuccessResult = {
    success: true,
    statusCode: 200,
    message: "Test Success Message",
    data: { info: "Test Info" },
    error: null,
  };

  const mockErrorResult = {
    success: false,
    statusCode: 500,
    message: "Test message",
    data: null,
    error: new AppError("Test Error", 500),
  };

  test("should send send successful res message", () => {
    const result = handleCrudOpResult(mockRes, mockSuccessResult);

    expect(result).toBe(undefined);
    expect(mockRes.status).toBeCalledWith(mockSuccessResult.statusCode);
    expect(mockRes.json).toBeCalledWith(
      successResponse(
        mockSuccessResult.message,
        mockSuccessResult.statusCode,
        mockSuccessResult.data,
      ),
    );
  });
  test("should return error response", () => {
    const result = handleCrudOpResult(mockRes, mockErrorResult);

    expect(result).toStrictEqual(expect.any(AppError));
  });
});
