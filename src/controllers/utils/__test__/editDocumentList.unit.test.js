import AppError from "#utils/appError";
import editDocumentList from "../editDocumentList";
import { successResponse, errorResponse } from "#responses/response";

vi.mock("#responses/response", () => ({
  default: undefined,
  errorResponse: vi.fn(),
  successResponse: vi.fn(),
}));

describe("editDocumentList()", () => {
  const document = {
    testList: {
      pull: vi.fn(),
      push: vi.fn(),
    },
  };

  const mockSuccessResponse = {
    success: true,
    statusCode: 200,
    message: "Successful message",
    data: document,
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    statusCode: 500,
    message: "Unsuccessful message",
    data: null,
    error: new AppError("Unsuccessful message", 500),
  };

  test("should successfully pull a document from the list", () => {
    successResponse.mockReturnValueOnce(mockSuccessResponse);

    const kwargs = {
      documentList: "testList",
      action: "pull",
      subDocId: "testId0",
    };
    const response = editDocumentList(document, kwargs);

    expect(document.testList.pull).toBeCalledWith("testId0");
    expect(successResponse).toBeCalledWith(
      "Successfully edited testList",
      200,
      document,
    );
    expect(response).toEqual(mockSuccessResponse);
  });

  test("should successfully push a document to the list", () => {
    successResponse.mockReturnValueOnce(mockSuccessResponse);

    const kwargs = {
      documentList: "testList",
      action: "push",
      subDocId: "testId1",
    };
    const response = editDocumentList(document, kwargs);

    expect(document.testList.push).toBeCalledWith("testId1");
    expect(successResponse).toBeCalledWith(
      "Successfully edited testList",
      200,
      document,
    );
    expect(response).toEqual(mockSuccessResponse);
  });

  test("should return error response when documentList does not exist", () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    const kwargs = {
      documentList: "invalidList",
      action: "push",
      subDocId: "testId2",
    };
    const response = editDocumentList(document, kwargs);

    expect(document.testList.pull).not.toBeCalled();
    expect(document.testList.push).not.toBeCalled();
    expect(errorResponse).toBeCalledWith(
      "Document list invalidList does not exist",
      400,
    );
    expect(response).toEqual(mockErrorResponse);
  });

  test("should return error when invalid action provided", () => {
    errorResponse.mockReturnValueOnce(mockErrorResponse);

    const kwargs = {
      documentList: "testList",
      action: "turn",
      subDocId: "testId3",
    };
    const response = editDocumentList(document, kwargs);

    expect(document.testList.push).not.toBeCalled();
    expect(document.testList.pull).not.toBeCalled();
    expect(errorResponse).toBeCalledWith("Action not provided", 400);
    expect(response).toEqual(mockErrorResponse);
  });
});
