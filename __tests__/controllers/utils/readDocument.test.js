// @vitest-environment mongoose

import readDocument from "#controllers/utils/readDocument.js";

describe("readDocument()", () => {
  let testDocuments;
  beforeAll(async () => {
    testDocuments = [
      { name: "Jane", age: 23, gender: "female" },
      { name: "Joe", age: 35, gender: "male" },
      { name: "John", age: 55, gender: "male" },
    ];
    await testModel.insertMany(testDocuments);
  });

  test("should return success object when successful", async () => {
    // Find documents
    const result = await readDocument(testModel, testDocuments[0]);

    // Expect successful return object
    expect(result.success).toBeTruthy();
    expect(result.message).toBeTruthy();
    expect(result.data.length).toBe(1);
    expect(result.error).toBe(null);
  });

  test("should return a list of found documents", async () => {
    // Find documents
    const result = await readDocument(testModel, {});

    // Expect return object to contain a list of found documents
    expect(result.data.length).toBe(testDocuments.length);
  });

  test("should return failure object if nothing found", async () => {
    const invalidDocument = { name: "invalidDepartmentName" };

    // Find documents
    const result = await readDocument(testModel, invalidDocument);

    // Expect failure return object
    expect(result.success).toBeFalsy();
    expect(result.message).toBeTruthy();
    expect(result.data.length).toBe(0);
    expect(result.error).toBeTruthy();
  });
});
