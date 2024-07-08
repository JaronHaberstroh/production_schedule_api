import AppError from "#utils/AppError.js";
import {
  createDocument,
  findDocument,
  findDocumentById,
  updateDocument,
  deleteDocument,
  saveDocument,
} from "../mongoService";

describe("mongoService.js", () => {
  let mockModel, mockParams, mockDocument, mockSession;
  beforeEach(() => {
    mockModel = {
      findById: vi.fn(),
      find: vi.fn(),
      deleteOne: vi.fn(),
    };

    mockDocument = {
      save: vi.fn(),
    };

    mockParams = {
      _id: "test id",
      name: "test name",
    };

    mockSession = { session: undefined };
  });

  describe("createDocumnet()", () => {
    test("should create document and return result", () => {
      mockModel = vi.fn();
      mockModel.mockImplementation((params) => {
        return { ...params };
      });

      const document = createDocument(mockModel, mockParams);

      expect(mockModel).toBeCalledWith(mockParams);
      expect(document).toEqual({ ...mockParams });
    });
  });

  describe("findDocument()", () => {
    test("should return found results", async () => {
      const docs = [{ _id: "testId0", docName: "testDoc0" }];
      mockModel.find.mockResolvedValueOnce(docs);

      const results = await findDocument(mockModel, mockParams);

      expect(mockModel.find).toBeCalledWith(mockParams);
      expect(results).toBe(docs);
    });

    test("should throw error if result length is 0", async () => {
      mockModel.find.mockResolvedValueOnce([]);

      const testCase = async () => {
        await findDocument(mockModel, mockParams);
      };
      await expect(testCase).rejects.toThrowError(expect.any(AppError));
    });

    test("should throw error if error occurs", async () => {
      const error = new AppError("Failed to find results");

      mockModel.find.mockRejectedValueOnce(error);
      const testCase = async () => {
        await findDocument(mockModel, mockParams);
      };

      await expect(testCase).rejects.toThrowError(expect.any(Error));
    });
  });

  describe("findDocumentById()", () => {
    test("should find document by given id", async () => {
      const testDocument = { _id: mockParams };

      mockModel.findById.mockResolvedValueOnce(testDocument);
      const result = await findDocumentById(mockModel, mockParams);

      expect(mockModel.findById).toBeCalledWith(mockParams);
      expect(result).toBe(testDocument);
    });

    test("should throw error when no document found", async () => {
      mockModel.findById.mockResolvedValueOnce(null);

      const testCase = async () =>
        await findDocumentById(mockModel, mockParams);

      await expect(testCase).rejects.toThrowError(expect.any(AppError));
    });

    test("should throw error when error occurs", async () => {
      const error = new AppError("Error while searching for documents");
      mockModel.findById.mockRejectedValueOnce(error);

      const testCase = async () =>
        await findDocumentById(mockModel, mockParams);

      await expect(testCase).rejects.toThrowError(expect.any(Error));
    });
  });

  describe("updateDocument()", () => {
    const document = { _id: "test id", name: "original name" };

    test("should return updated document with merged properties", () => {
      const params = { name: "updated name" };

      const result = updateDocument({ ...document }, params);

      const expectedResult = { _id: "test id", name: "updated name" };

      expect(result).toEqual(expectedResult);
    });

    test("should add new fields", () => {
      const params = { age: 34, time: "now" };

      const result = updateDocument({ ...document }, params);

      const expectedResult = {
        _id: "test id",
        name: "original name",
        age: 34,
        time: "now",
      };

      expect(result).toEqual(expectedResult);
    });

    test("should return original document if params are empty", () => {
      const params = {};

      const result = updateDocument({ ...document }, params);

      expect(result).toEqual(document);
    });
  });

  describe("deleteDocument()", () => {
    const mockData = { acknowledge: true, deletedCount: 1 };

    test("should delete document with given params", async () => {
      mockModel.deleteOne.mockResolvedValueOnce(mockData);

      await deleteDocument(mockModel, mockParams);

      expect(mockModel.deleteOne).toBeCalledWith(mockParams, mockSession);
    });

    test("should throw error if no documents delelted", async () => {
      mockModel.deleteOne.mockResolvedValueOnce({
        acknowledge: true,
        deletedCount: 0,
      });

      const testCase = async () => await deleteDocument(mockModel, mockParams);

      await expect(testCase).rejects.toThrowError(expect.any(AppError));
    });

    test("should throw error when error occurs", async () => {
      const error = new AppError("Document not deleted");
      mockModel.deleteOne.mockRejectedValueOnce(error);

      const testCase = async () => await deleteDocument(mockModel, mockParams);

      await expect(testCase).rejects.toThrowError(expect.any(Error));
    });
  });

  describe("saveDocument()", () => {
    test("should save document and return result", async () => {
      const mockResult = { _id: "test id", name: "test name" };
      mockDocument.save.mockResolvedValueOnce(mockResult, {});

      const result = await saveDocument(mockDocument);

      expect(mockDocument.save).toBeCalledWith({ session: undefined });
      expect(result).toBe(mockResult);
    });

    test("should return an error response if saving the document is unsuccessful", async () => {
      mockDocument.save.mockResolvedValueOnce();

      const testCase = async () => await saveDocument(mockDocument);

      await expect(testCase).rejects.toThrowError(expect.any(AppError));
    });

    test("should return error response if saving document returns an error", async () => {
      const error = new AppError("Save failed");
      mockDocument.save.mockRejectedValueOnce(error);

      const testCase = async () => await saveDocument(mockDocument);

      await expect(testCase).rejects.toThrowError(expect.any(Error));
    });
  });
});
