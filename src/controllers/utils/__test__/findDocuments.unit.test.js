import findDocuments from "../findDocuments.js";
import AppError from "#utils/appError.js";
import { Error } from "mongoose";
import { successResponse, errorResponse } from "#responses/response.js";

vi.mock("#responses/response", () => ({
  default: undefined,
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));

describe("findDocuments()", () => {
  const mockSuccessResponse = {
    success: true,
    statusCode: 200,
    message: "Successful message",
    data: [],
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
    mockModel = { find: vi.fn() };

    mockParams = { searchParam0: "test param", searchParam1: "test param" };
  });

  test("should return all documents if no search params provided", async () => {
    const data = [
      { _id: "testId0", docName: "testDoc0" },
      { _id: "testId1", docName: "testDoc1" },
      { _id: "testId0", docName: "testDoc0" },
    ];

    successResponse.mockReturnValueOnce({
      ...mockSuccessResponse,
      data,
    });

    mockModel.find.mockResolvedValueOnce(data);
    const response = await findDocuments(mockModel, mockParams);

    expect(mockModel.find).toBeCalledWith(mockParams);
    expect(successResponse).toBeCalled();
    expect(response).toEqual({ ...mockSuccessResponse, data });
  });

  test("should return all documents fitting search params", async () => {
    const data = [
      { _id: "testId0", docName: "testDoc0" },
      { _id: "testId1", docName: "testDoc1" },
      { _id: "testId2", docName: "testDoc2" },
    ];

    successResponse.mockReturnValueOnce({
      ...mockSuccessResponse,
      data: [data[0], data[1]],
    });

    mockModel.find.mockResolvedValueOnce([data[0], data[1]]);
    const response = await findDocuments(mockModel, mockParams);

    expect(mockModel.find).toBeCalledWith(mockParams);
    expect(successResponse).toBeCalled();
    expect(response).toEqual({
      ...mockSuccessResponse,
      data: [data[0], data[1]],
    });
  });

  test("should return error response if error thrown during operation", async () => {
    const error = new Error("Failed to find documents");

    errorResponse.mockReturnValueOnce(mockErrorResponse);

    mockModel.find.mockRejectedValueOnce(error);
    const response = await findDocuments(mockModel, mockParams);

    expect(mockModel.find).toBeCalledWith(mockParams);
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });

  test("should return error response if no search results found", async () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    mockModel.find.mockResolvedValueOnce([]);
    const response = await findDocuments(mockModel, mockParams);

    expect(mockModel.find).toBeCalledWith(mockParams);
    expect(errorResponse).toBeCalled();
    expect(response).toEqual(mockErrorResponse);
  });
});
