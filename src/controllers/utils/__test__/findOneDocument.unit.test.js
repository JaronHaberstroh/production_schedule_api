import findOneDocument from "../findOneDocument";
import AppError from "#utils/appError";
import { Error } from "mongoose";
import { successResponse, errorResponse } from "#responses/response";

vi.mock("#responses/response", () => ({
  default: undefined,
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));

describe("findOneDocument()", () => {
  const mockSuccessResponse = {
    success: true,
    statusCode: 200,
    message: "Successful message",
    data: "test document",
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    statusCode: 500,
    message: "Unsuccessful message",
    data: null,
    error: new AppError("Unsuccessful message", 500),
  };

  let mockModel, mockParams;
  beforeAll(() => {
    mockModel = { findOne: vi.fn() };

    mockParams = { name: "test name" };
  });

  test("should find one document matching given params", async () => {
    successResponse.mockReturnValueOnce(mockSuccessResponse);

    mockModel.findOne.mockResolvedValueOnce("test document");
    const response = await findOneDocument(mockModel, mockParams);

    expect(mockModel.findOne).toBeCalled();
    expect(successResponse).toBeCalled();
    expect(response).toEqual(mockSuccessResponse);
  });

  test("should return error response when no document returned from operation", async () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    mockModel.findOne.mockResolvedValueOnce(null);
    const response = await findOneDocument(mockModel, mockParams);

    expect(mockModel.findOne).toBeCalled();
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });

  test("should return error response when operation throws error", async () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    const error = new Error("Failed to find document");

    mockModel.findOne.mockRejectedValueOnce(error);
    const response = await findOneDocument(mockModel, mockParams);

    expect(mockModel.findOne).toBeCalled();
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });
});
