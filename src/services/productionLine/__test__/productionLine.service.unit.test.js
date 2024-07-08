import * as lineService from "../productionLine.service";
import {
  pullFromProductionLines,
  pushToProductionLines,
} from "../../department/productionLinesList";
import {
  createDocument,
  findDocument,
  findDocumentById,
  updateDocument,
  deleteDocument,
  saveDocument,
} from "../../mongoService";
import ProductionLine from "#models/productionLine";

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

vi.mock("../../department/productionLinesList", () => {
  return {
    default: vi.fn(),
    pushToProductionLines: vi.fn(),
    pullFromProductionLines: vi.fn(),
  };
});

describe("productionLineService", () => {
  let productionLineId,
    departmentId,
    productionLineParams,
    productionLineDocument,
    departmentDocument,
    session;
  beforeEach(() => {
    productionLineId = "production line id";
    departmentId = "department id";
    productionLineParams = {
      name: "production line name",
      department: departmentId,
    };
    productionLineDocument = {
      _id: productionLineId,
      ...productionLineParams,
    };
    departmentDocument = {
      productionLines: {
        push: vi.fn(),
        pull: vi.fn(),
      },
    };
    session = {};
  });

  describe("addProductionLine()", () => {
    beforeEach(() => {
      createDocument.mockReturnValueOnce(productionLineDocument);
      saveDocument.mockResolvedValueOnce(productionLineDocument);
      pushToProductionLines.mockResolvedValueOnce(departmentDocument);
    });

    test("should create and save production line document", async () => {
      await lineService.addProductionLine(productionLineParams, session);

      expect(createDocument).toBeCalledWith(
        ProductionLine,
        productionLineParams,
      );
      expect(saveDocument).toBeCalledWith(productionLineDocument, session);
    });

    test("should call on department service to add production line to department", async () => {
      await lineService.addProductionLine(productionLineParams, session);

      expect(pushToProductionLines).toBeCalledWith(
        departmentId,
        productionLineId,
        session,
      );
    });

    test("should return an object containing the created production line and updated department", async () => {
      const result = await lineService.addProductionLine(
        productionLineParams,
        session,
      );

      expect(result).toEqual({
        department: departmentDocument,
        productionLine: productionLineDocument,
      });
    });
  });

  describe("fetch production lines", () => {
    describe("fetchAllProductionLines()", () => {
      test("should find and return all production lines", async () => {
        const lines = ["test line0", "test line1", "test line2"];
        findDocument.mockResolvedValueOnce(lines);

        const result = await lineService.fetchAllProductionLines();

        expect(findDocument).toBeCalledWith(ProductionLine, {});
        expect(result).toBe(lines);
      });
    });

    describe("fetchProductionLineById()", () => {
      test("should find and return production line with given id", async () => {
        findDocumentById.mockResolvedValueOnce(productionLineDocument);

        const result =
          await lineService.fetchProductionLineById(productionLineId);

        expect(findDocumentById).toBeCalledWith(
          ProductionLine,
          productionLineId,
        );
        expect(result).toBe(productionLineDocument);
      });
    });

    // FIX: This doesn't work! Terrible code!!!!
    // describe("fetchProductionLinesByDepartment", () => {
    // test("should find all production lines by given department", async () => {
    //     const lines = ["test line0", "test line1", "test line2"];
    //     fetchDepartmentById.mockResolvedValueOnce(departmentDocument);
    //     const result =
    //       await lineService.fetchProductionLinesByDepartment(oldDepartmentId);
    //     expect(fetchDepartmentById).toBeCalledWith(oldDepartmentId);
    //     expect(result).toBe(lines);
    //   });
    // });
  });

  describe("editProductionLine()", () => {
    let oldDepartmentId, newDepartmentId, params, updatedProductionLine;
    beforeEach(() => {
      oldDepartmentId = "old department id";
      newDepartmentId = "new department id";
      params = {
        productionLineId,
        lineParams: { name: "updated name", department: newDepartmentId },
        oldDepartmentId,
        newDepartmentId,
      };
      updatedProductionLine = {
        ...productionLineDocument,
        ...params.lineParams,
      };
      findDocumentById.mockResolvedValueOnce(productionLineDocument);
      updateDocument.mockReturnValueOnce(updatedProductionLine);
      saveDocument.mockResolvedValueOnce(updatedProductionLine);
      pushToProductionLines.mockResolvedValueOnce(departmentDocument);
      pullFromProductionLines.mockResolvedValueOnce(departmentDocument);
    });

    test("should fetch, update, and save production line document", async () => {
      await lineService.editProductionLine(params, session);

      expect(findDocumentById).toBeCalledWith(ProductionLine, productionLineId);
      expect(updateDocument).toBeCalledWith(
        productionLineDocument,
        params.lineParams,
      );
      expect(saveDocument).toBeCalledWith(updatedProductionLine, session);
    });

    test("should call department service to update departments", async () => {
      await lineService.editProductionLine(params, session);

      expect(pushToProductionLines).toBeCalledWith(
        newDepartmentId,
        productionLineId,
        session,
      );
      expect(pullFromProductionLines).toBeCalledWith(
        oldDepartmentId,
        productionLineId,
        session,
      );
    });

    test("should return an object containing productionLine, oldDepartment, and newDepartment", async () => {
      const result = await lineService.editProductionLine(params, session);

      const expected = {
        productionLine: updatedProductionLine,
        department: [departmentDocument, departmentDocument],
      };
      expect(result).toEqual(expected);
    });
  });

  describe("removeProductionLine()", () => {
    let params;
    beforeEach(() => {
      params = { departmentId: departmentId, productionLineId };

      deleteDocument.mockResolvedValueOnce();
      pullFromProductionLines.mockResolvedValueOnce(departmentDocument);
    });

    test("should delete production line", async () => {
      lineService.removeProductionLine(params, session);

      expect(deleteDocument).toBeCalledWith(
        ProductionLine,
        { _id: productionLineId },
        session,
      );
    });

    test("should call department service to remove production line from department document", async () => {
      await lineService.removeProductionLine(params, session);

      expect(pullFromProductionLines).toBeCalledWith(
        departmentId,
        productionLineId,
        session,
      );
    });

    test("should return object containing empty productionline and updated department document", async () => {
      const result = await lineService.removeProductionLine(params, session);

      const expected = {
        productionLine: {},
        department: departmentDocument,
      };
      expect(result).toEqual(expected);
    });
  });
});
