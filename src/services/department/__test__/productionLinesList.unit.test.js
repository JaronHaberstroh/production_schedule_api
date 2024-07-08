import Department from "#models/department";
import {
  pushToProductionLines,
  pullFromProductionLines,
} from "../productionLinesList";
import { findDocumentById, saveDocument } from "../../mongoService";

vi.mock("../../mongoService", () => {
  return {
    default: vi.fn(),
    findDocumentById: vi.fn(),
    saveDocument: vi.fn(),
  };
});

describe("productionLinesList", () => {
  let departmentId, productionLineId, departmentDocument;
  beforeEach(() => {
    departmentId = " department id";
    productionLineId = "production line id";
    departmentDocument = {
      _id: departmentId,
      productionLines: {
        push: vi.fn(),
        pull: vi.fn(),
      },
    };
    findDocumentById.mockResolvedValueOnce(departmentDocument);
    saveDocument.mockResolvedValueOnce(departmentDocument);
  });

  describe("pushToProductionLines()", () => {
    beforeEach(() => {
      departmentDocument.productionLines.push.mockReturnValueOnce({
        ...departmentDocument,
      });
    });

    test("should find department, push production line, and save", async () => {
      await pushToProductionLines(departmentId, productionLineId);

      expect(findDocumentById).toBeCalledWith(Department, departmentId);
      expect(departmentDocument.productionLines.push).toBeCalledWith(
        productionLineId,
      );
      expect(saveDocument).toBeCalledWith(departmentDocument, undefined);
    });

    test("should return updated department document", async () => {
      const result = await pushToProductionLines(
        departmentId,
        productionLineId,
      );

      expect(result).toEqual(departmentDocument);
    });
  });

  describe("pullFromProductionLines()", () => {
    beforeEach(() => {
      departmentDocument.productionLines.pull.mockReturnValueOnce({
        ...departmentDocument,
      });
    });

    test("should pull production line from productionLines list", async () => {
      await pullFromProductionLines(departmentId, productionLineId);

      expect(findDocumentById).toBeCalledWith(Department, departmentId);
      expect(departmentDocument.productionLines.pull).toBeCalledWith(
        productionLineId,
      );
      expect(saveDocument).toBeCalledWith(departmentDocument, undefined);
    });

    test("should return updated department document", async () => {
      const result = await pullFromProductionLines(
        departmentId,
        productionLineId,
      );

      expect(result).toEqual(departmentDocument);
    });
  });
});
