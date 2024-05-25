import Department from "#models/department";
import mongoose from "mongoose";
import editDocumentList from "../editDocumentList";

describe("editDocumentList()", () => {
  const testId0 = new mongoose.Types.ObjectId();
  const testId1 = new mongoose.Types.ObjectId();
  const testId2 = new mongoose.Types.ObjectId();
  const testDocument = Department({
    departmentName: "Test Department",
    productionLines: [testId0, testId1, testId2],
  });

  test("should return edited document when successful", () => {
    const result = editDocumentList(testDocument, {
      documentList: "productionLines",
      action: "pull",
      subDocId: testId0,
    });

    expect(result.productionLines).not.toContain(testId0);
  });

  test("should return error when invalid action provided", () => {
    const result = editDocumentList(testDocument, {
      documentList: "productionLines",
      action: "turn",
      subDocId: testId1,
    });

    expect(result.success).toBeFalsy();
    expect(result.message).toBeTruthy();
    expect(result.statusCode).toBeTruthy();
    expect(result.data).toBe(null);
    expect(result.error).toBeTypeOf("object");
  });
});
