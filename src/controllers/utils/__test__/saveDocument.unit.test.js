import { successResponse, errorResponse } from "#responses/response";
import AppError from "#utils/appError";
import { Error } from "mongoose";
import saveDocument from "../saveDocument";

vi.mock("#responses/response", () => ({
  default: undefined,
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));

describe("saveDocument()", () => {
  const mockData = { _id: "test id", name: "test name" };

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

  let mockDocument;
  beforeAll(() => {
    mockDocument = {
      save: vi.fn(),
    };
  });

  test("should return success response if saving the document is successful", async () => {
    mockDocument.save.mockResolvedValueOnce(mockData);

    successResponse.mockReturnValueOnce(mockSuccessResponse);

    const response = await saveDocument(mockDocument);

    expect(mockDocument.save).toBeCalled();
    expect(successResponse).toBeCalled();
    expect(response).toBe(mockSuccessResponse);
  });

  test("should return an error response if saving the document is unsuccessful", async () => {
    mockDocument.save.mockRejectedValueOnce({});

    errorResponse.mockReturnValueOnce(mockErrorResponse);

    const response = await saveDocument(mockDocument);

    expect(mockDocument.save).toBeCalled();
    expect(errorResponse).toBeCalled();
    expect(response).toBe(mockErrorResponse);
  });

  test("should return error response if saving document returns an error", async () => {
    const error = new Error("Save failed");
    mockDocument.save.mockRejectedValueOnce(error);

    errorResponse.mockReturnValueOnce(mockErrorResponse);

    const response = await saveDocument(mockDocument);

    expect(mockDocument.save).toBeCalled();
    expect(errorResponse).toBeCalled();
    expect(response).toBe(mockErrorResponse);
  });
});
