// @vitest-environment mongoose

import updateDocumment from "../updateDocument.js";

describe("updateDocument()", () => {
  let testDocument, updateDocumentData;
  beforeEach(async () => {
    // Create testDocument in DB
    const document = new testModel(testData);
    testDocument = await document.save();

    // Create updateDocumentData
    updateDocumentData = {
      query: testDocument._id,
      params: { name: "Jane", age: 34, gender: "female" },
    };
  });

  test("should return success object when successful", async () => {
    // Call update document
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

    // Call update document
    const updatedDocument = await testModel.findOne(testDocument._id);

    // Expect document to have been updated
    expect(updatedDocument.name).toBe(updateDocumentData.params.name);
  });

  test("should return fail object when fails", async () => {
    // Alter test variables to force fail
    updateDocumentData.query = null;

    // Call update document
    const result = await updateDocumment(testModel, updateDocumentData);

    // Expect failure return object
    expect(result.success).toBeFalsy();
    expect(result.message).toBeTruthy();
    expect(result.data).toBe(null);
    expect(result.error).toBeTypeOf("object");
  });
});
