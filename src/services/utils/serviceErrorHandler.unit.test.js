import serviceErrorHandler from "./serviceErrorHandler";
import AppError from "#utils/AppError";

describe("serviceErrorHandler()", () => {
  let mockModel;
  beforeEach(() => {
    mockModel = {
      modelName: "testName",
    };
  });

  test("should format and return AppError", () => {
    const error = new AppError("failed message", 400);

    const result = serviceErrorHandler(mockModel, error);

    expect(result.error).toBeTruthy();
    expect(result.error.message).toContain("Service Error: testName,");
  });

  test("should format and return unhandled exceptions", () => {
    const error = new Error("failed message");

    const result = serviceErrorHandler(mockModel, error);

    expect(result.error).toBeTruthy();
    expect(result.error.message).toContain("Unhandled Exception: testName,");
  });
});
