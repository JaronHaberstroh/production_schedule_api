import deleteDocument from "../deleteDocument.js";
import { successResponse, errorResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";
import { Error } from "mongoose";

vi.mock("#responses/response", () => ({
  default: undefined,
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));

describe("deleteDocument()", () => {
  const mockData = { acknowledge: true, deletedCount: 1 };

  const mockSuccessResponse = {
    success: true,
    statusCode: 200,
    message: "Successful message",
    data: mockData,
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    statusCode: 500,
    message: "Unsuccessful message",
    data: null,
    error: new AppError("Unsuccessful message", 500),
  };

  let mockModel, mockParams, mockSession;
  beforeAll(() => {
    mockModel = { deleteOne: vi.fn() };

    mockParams = { _id: "test id" };

    mockSession = { session: undefined };
  });

  test("should return success response if deleting document is successful", async () => {
    successResponse.mockReturnValueOnce(mockSuccessResponse);

    mockModel.deleteOne.mockResolvedValueOnce(mockData);

    const response = await deleteDocument(mockModel, mockParams);

    expect(mockModel.deleteOne).toBeCalledWith(mockParams, mockSession);
    expect(successResponse).toBeCalled();
    expect(response).toEqual(mockSuccessResponse);
  });

  test("should return error response if deleting document throws an error", async () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    const error = new Error("Document not deleted");
    mockModel.deleteOne.mockRejectedValueOnce(error);

    const response = await deleteDocument(mockModel, mockParams);

    expect(mockModel.deleteOne).toBeCalledWith(mockParams, mockSession);
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });

  test("should return error response when document is not deleted", async () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    mockModel.deleteOne.mockRejectedValueOnce({
      acknowledge: true,
      deletedCount: 0,
    });

    const response = await deleteDocument(mockModel, mockParams);

    expect(mockModel.deleteOne).toBeCalledWith(mockParams, mockSession);
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });
});
