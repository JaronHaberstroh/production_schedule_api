import unhanledRoutesHandler from "src/middleware/unhandledRoutesHandler.js";
import AppError from "#utils/AppError.js";

describe("unhandledRoutesHandler middleware", () => {
  beforeAll(() => {
    mockReq = { originalUrl: "/nonexistent-route", method: "GET" };
  });

  test("creates instance of AppError and calls next", () => {
    unhanledRoutesHandler(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
  });
});
