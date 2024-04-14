// @vitest-environment express

import errorHandler from "src/middleware/errorHandler.js";

describe("errroHandler middleware", () => {
  let mockError;
  beforeAll(() => {
    mockError = {
      message: "test message",
      statusCode: 404,
      error: vi.fn(),
      stack: vi.fn(),
    };
  });

  beforeEach(() => {
    mockRes.headerSent = false;
  });

  test("should do nothing if res.headerSent is true", () => {
    mockRes.headerSent = true;

    errorHandler(mockError, mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(mockError);
  });

  test("should send proper response", () => {
    // Call errorHandler
    errorHandler(mockError, mockReq, mockRes, mockNext);

    // Expect res to contain all info for client
    expect(mockRes.status).toBeCalledWith(404);
    expect(mockRes.json).toBeCalledWith({
      status: 404,
      message: "test message",
      stack: mockError.stack,
    });
  });
});
