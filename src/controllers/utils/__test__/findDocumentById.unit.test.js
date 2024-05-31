import findDocumentById from "../findDocumentById";
import AppError from "#utils/appError";
import { Error } from "mongoose";
import { successResponse, errorResponse } from "#responses/response";

vi.mock("#responses/response", () => ({
  default: undefined,
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));

describe("findDocumentById()", () => {
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
    mockModel = { findById: vi.fn() };

    mockParams = { _id: "test id" };
  });

  test("should find document by given id", async () => {
    successResponse.mockReturnValueOnce(mockSuccessResponse);

    mockModel.findById.mockResolvedValueOnce("test document");
    const response = await findDocumentById(mockModel, mockParams);

    expect(mockModel.findById).toBeCalledWith(mockParams);
    expect(successResponse).toBeCalled();
    expect(response).toEqual(mockSuccessResponse);
  });

  test("should return error response if document is not found", async () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    mockModel.findById.mockResolvedValueOnce(null);
    const response = await findDocumentById(mockModel, mockParams);

    expect(mockModel.findById).toBeCalledWith(mockParams);
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });

  test("should return error response if error is thrown during operation", async () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    const error = new Error("Error while searching for documents");

    mockModel.findById.mockRejectedValueOnce(error);
    const response = await findDocumentById(mockModel, mockParams);

    expect(mockModel.findById).toBeCalledWith(mockParams);
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });
});
