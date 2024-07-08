import Department from "#models/department";
import * as departmentService from "../department.service";
import {
  createDocument,
  findDocument,
  findDocumentById,
  deleteDocument,
  saveDocument,
} from "../../mongoService";

vi.mock("../../mongoService", () => {
  return {
    default: vi.fn(),
    createDocument: vi.fn(),
    findDocument: vi.fn(),
    findDocumentById: vi.fn(),
    deleteDocument: vi.fn(),
    saveDocument: vi.fn(),
  };
});

describe("departmentService", () => {
  let departmentId, params;
  beforeEach(() => {
    departmentId = "test department id";
    params = { name: "department name" };
  });

  describe("addDepartment()", () => {
    let departmentDocument;
    beforeEach(() => {
      departmentDocument = {
        _id: departmentId,
        ...params,
      };
      createDocument.mockReturnValueOnce(departmentDocument);
      saveDocument.mockReturnValueOnce(departmentDocument);
    });

    test("should create and save department document", async () => {
      await departmentService.addDepartment(params);

      expect(createDocument).toBeCalledWith(Department, params);
      expect(saveDocument).toBeCalledWith(departmentDocument, undefined);
    });

    test("should return department document", async () => {
      const result = await departmentService.addDepartment(params);

      expect(result).toEqual(departmentDocument);
    });
  });

  describe("fetch department", () => {
    const expectedResult = [
      { _id: "first id", name: "first name" },
      { _id: "second id", name: "second name" },
      { _id: "third id", name: "third name" },
    ];

    describe("fetchAllDepartments()", () => {
      test("should fetch and return all departments", async () => {
        findDocument.mockResolvedValueOnce(expectedResult);

        const result = await departmentService.fetchAllDepartments();

        expect(findDocument).toBeCalledWith(Department, {});
        expect(result).toEqual(expectedResult);
      });

      test("should fetch and return departments matching params", async () => {
        findDocument.mockResolvedValueOnce(expectedResult);

        const result = await departmentService.fetchAllDepartments(params);

        expect(findDocument).toBeCalledWith(Department, params);
        expect(result).toEqual(expectedResult);
      });
    });

    describe("fetchDepartmentById()", () => {
      test("should fetch and return department matching id", async () => {
        findDocumentById.mockResolvedValueOnce(expectedResult);

        const result =
          await departmentService.fetchDepartmentById(departmentId);

        expect(findDocumentById).toBeCalledWith(Department, departmentId);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe("removeDepartment()", () => {
    beforeEach(() => {
      deleteDocument.mockResolvedValueOnce();
    });

    test("should delete department document", async () => {
      await departmentService.removeDepartment(departmentId);

      expect(deleteDocument).toBeCalledWith(
        Department,
        { _id: departmentId },
        undefined,
      );
    });
  });
});
