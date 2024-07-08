import WorkPosition from "#models/workPosition";
import * as workPositionService from "../workPosition.service";
import {
  createDocument,
  findDocument,
  findDocumentById,
  updateDocument,
  deleteDocument,
  saveDocument,
} from "../../mongoService";

vi.mock("../../mongoService", () => {
  return {
    default: vi.fn(),
    createDocument: vi.fn(),
    findDocument: vi.fn(),
    findDocumentById: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
    saveDocument: vi.fn(),
  };
});

describe("workPositionService", () => {
  let workPositionId, params, workPositionDocument, session;
  beforeEach(() => {
    workPositionId = "work position id";
    params = { name: "work position name" };
    workPositionDocument = { _id: workPositionId, ...params };
  });

  describe("addWorkPosition()", () => {
    beforeEach(() => {
      createDocument.mockReturnValueOnce(workPositionDocument);
      saveDocument.mockResolvedValueOnce(workPositionDocument);
    });

    test("should create and save document", async () => {
      await workPositionService.addWorkPosition(params, session);

      expect(createDocument).toBeCalledWith(WorkPosition, params);
      expect(saveDocument).toBeCalledWith(workPositionDocument, session);
    });

    test("should return new document", async () => {
      const result = await workPositionService.addWorkPosition(params, session);

      expect(result).toEqual(workPositionDocument);
    });
  });

  describe("fetch work positions", () => {
    describe("fetchAllWorkPositions()", () => {
      let workPositionDocumentList;
      beforeEach(() => {
        workPositionDocumentList = {
          ...workPositionDocument,
          ...{ _id: "work position id 1", name: "work position name 1" },
          ...{ _id: "work position id 2", name: "work position name 2" },
          ...{ _id: "work position id 3", name: "work position name 3" },
        };

        findDocument.mockResolvedValueOnce(workPositionDocumentList);
      });

      test("should fetch all work positions", async () => {
        await workPositionService.fetchAllWorkPositions();

        expect(findDocument).toBeCalledWith(WorkPosition, {});
      });

      test("should return a list of work positions found", async () => {
        const result = await workPositionService.fetchAllWorkPositions();

        expect(result).toEqual(workPositionDocumentList);
      });
    });

    describe("fetchWorkPositionsById()", () => {
      beforeEach(() => {
        findDocumentById.mockResolvedValueOnce(workPositionDocument);
      });

      test("should fetch work position by id", async () => {
        await workPositionService.fetchWorkPositionById(workPositionId);

        expect(findDocumentById).toBeCalledWith(WorkPosition, workPositionId);
      });

      test("should return found work position", async () => {
        const result =
          await workPositionService.fetchWorkPositionById(workPositionId);

        expect(result).toEqual(workPositionDocument);
      });
    });
  });

  describe("editWorkPosition()", () => {
    let updatedParams, updatedDocument;
    beforeEach(() => {
      updatedParams = { name: "updated work position name" };
      updatedDocument = { ...workPositionDocument, ...updatedParams };

      findDocumentById.mockResolvedValueOnce(workPositionDocument);
      updateDocument.mockReturnValueOnce(updatedDocument);
      saveDocument.mockResolvedValueOnce(updatedDocument);
    });

    test("should update and save work position document", async () => {
      await workPositionService.editWorkPosition(
        workPositionId,
        updatedParams,
        session,
      );

      expect(findDocumentById).toBeCalledWith(WorkPosition, workPositionId);
      expect(updateDocument).toBeCalledWith(
        workPositionDocument,
        updatedParams,
      );
      expect(saveDocument).toBeCalledWith(updatedDocument, session);
    });

    test("should return updated work position document", async () => {
      const result = await workPositionService.editWorkPosition(
        workPositionId,
        params,
        session,
      );

      expect(result).toEqual(updatedDocument);
    });
  });

  describe("removeWorkPosition()", () => {
    beforeEach(() => {
      deleteDocument.mockResolvedValueOnce();
    });

    test("should delete document", async () => {
      await workPositionService.removeWorkPosition(workPositionId);

      expect(deleteDocument).toBeCalledWith(
        WorkPosition,
        { _id: workPositionId },
        session,
      );
    });

    test("should return empty object", async () => {
      const result =
        await workPositionService.removeWorkPosition(workPositionId);

      expect(result).toEqual({});
    });
  });
});
