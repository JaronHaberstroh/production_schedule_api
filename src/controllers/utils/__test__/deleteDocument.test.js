// @vitest-environment mongoose

import deleteDocument from "../deleteDocument.js";

describe("deleteDocument()", () => {
  let testDocument;
  beforeEach(async () => {
    // Create testDocument in DB
    const document = new testModel(testData);
    testDocument = await document.save();
  });

  test("should return success object on successful completion", async () => {
    // Delete document
    const result = await deleteDocument(testModel, testDocument._id);

    // Expect successful return object
    expect(result.success).toBeTruthy();
    expect(result.message).toBeTruthy();
    expect(result.data).toBeTruthy();
    expect(result.error).toBe(null);
  });

  test("should delete document from DB", async () => {
    // Delete document
    const result = await deleteDocument(testModel, testDocument._id);

    const deletedSearchResult = await testModel.findOne(testData);

    // Expect document to have been deleted
    expect(result.data.deletedCount).toEqual(1);
    expect(deletedSearchResult).toBe(null);
  });

  test("should return fail object when fails", async () => {
    // Delete document
    const result = await deleteDocument(testModel, { name: "jane" });

    // Expect failure return object
    expect(result.success).toBeFalsy();
    expect(result.message).toBeTruthy();
    expect(result.data).toBe(null);
    expect(result.error).toBeTypeOf("object");
  });
});
