// @vitest-environment mongoose

import updateDocumment from "#controllers/utils/updateDocument.js";

describe("updateDocument()", () => {
  let testDocument, updateDocumentData;
  beforeEach(async () => {
    // Create testDocument in DB
    const document = new testModel(testData);
    testDocument = await document.save();

    // Create updateDocumentData
    updateDocumentData = [
      testDocument._id,
      { name: "Jane", age: 34, gender: "female" },
    ];
  });

  test("should return success object when successful", async () => {
    // Update document
    const result = await updateDocumment(testModel, updateDocumentData);

    // Expect successful return object
    expect(result.success).toBeTruthy();
    expect(result.message).toBeTruthy();
    expect(result.data).toBeTruthy();
    expect(result.error).toBe(null);
  });

  test("should update document in DB", async () => {
    // Update document
    const result = await updateDocumment(testModel, updateDocumentData);

    const updatedDocument = await testModel.findOne(testDocument._id);

    // Expect document to have been updated
    expect(updatedDocument.name).toBe(updateDocumentData[1].name);
  });

  test("should return fail object when fails", async () => {
    updateDocumentData[0] = null;
    // Update document
    const result = await updateDocumment(testModel, updateDocumentData);

    // Expect failure return object
    expect(result.success).toBeFalsy();
    expect(result.message).toBeTruthy();
    expect(result.data).toBeTruthy();
    expect(result.error).toBeTypeOf("object");
  });
});
