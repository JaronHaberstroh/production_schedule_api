import createDepartment from "../createDepartment.js";
import createDocument from "#controllers/utils/createDocument.js";
import saveDocument from "#controllers/utils/saveDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

vi.mock("#controllers/utils/createDocument.js", () => ({ default: vi.fn() }));
vi.mock("#controllers/utils/saveDocument.js", () => ({ default: vi.fn() }));
vi.mock("#responses/response.js", () => ({
  default: vi.fn(),
  successResponse: vi.fn(),
}));

describe("Create department controller", () => {
  const testData = { departmentName: "testDepartment" };

  const mockSuccessResponse = {
    success: true,
    message: "test message",
    data: testData,
    error: null,
  };

  const mockErrorResponse = {
    success: false,
    message: "failed message",
    data: null,
    error: new AppError(),
  };

  mockReq.body = testData;

  test("should create and save document", async () => {
    createDocument.mockReturnValueOnce(testData);

    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    await createDepartment(mockReq, mockRes, mockNext);

    expect(createDocument).toBeCalledWith(Department, testData);
    expect(saveDocument).toBeCalledWith(testData);
  });

  test("should return success response when successful", async () => {
    saveDocument.mockResolvedValueOnce(mockSuccessResponse);

    await createDepartment(mockReq, mockRes, mockNext);

    expect(successResponse).toBeCalled();
    expect(mockRes.status).toBeCalled();
    expect(mockRes.json).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });

  test("should pass error to next if unsuccessful", async () => {
    saveDocument.mockRejectedValueOnce(mockErrorResponse);

    await createDepartment(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledWith(expect.any(AppError));
    expect(mockRes.status).not.toBeCalled();
    expect(mockRes.json).not.toBeCalled();
  });
});
