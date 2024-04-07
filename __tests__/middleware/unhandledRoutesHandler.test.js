// @vitest-environment express

import unhanledRoutesHandler from "src/middleware/unhandledRoutesHandler.js";
import AppError from "#utils/appError.js";

describe("unhandledRoutesHandler middleware", () => {
  beforeAll(() => {
    mockReq = { originalUrl: "/nonexistent-route", method: "GET" };
  });

  test("creates instance of AppError and calls next", () => {
    // Call middleware
    unhanledRoutesHandler(mockReq, mockRes, mockNext);

    // Expect AppError to be create and next() to be called
    expect(mockNext).toBeCalled();
    expect(mockNext).toBeCalledWith(
      new AppError(
        `Path ${mockReq.originalUrl} does not exist for ${mockReq.method} method`,
        404
      )
    );
    expect(mockNext).toHaveReturned();
  });
});
