import AppError from "#utils/AppError.js";

describe("Custom AppError", () => {
  let message, statusCode;

  beforeAll(() => {
    // Set test variables
    message = "test message";
    statusCode = 404;
  });

  test("calling AppError creates new instance of AppError", () => {
    // Create instance of AppError
    const error = () => {
      throw new AppError(message, statusCode);
    };

    // Expect calling AppError to create instance of AppError
    expect(error).toThrowError(new AppError(message, statusCode));
  });

  test("should return message and status in error code", () => {
    const error = new AppError(message, statusCode);

    // Expect error to contain message and statusCode
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
  });
});
