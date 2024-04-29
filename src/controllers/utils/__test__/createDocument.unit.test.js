import createDocument from "../createDocument.js";

describe("createDocumnet()", () => {
  test("should return success object on successful completion", async () => {
    // Create document
    const document = await createDocument(testModel, testData);

    // Expect successful return object
    expect(document.success).toBeTruthy();
    expect(document.message).toBeTruthy();
    expect(document.data).toBeTruthy();
    expect(document.error).toBe(null);
  });

  test("should create document in DB", async () => {
    // Create document
    const document = await createDocument(testModel, testData);

    // Find document in DB
    const result = await testModel.findOne(document.data._id);

    // Expect data to be in DB
    expect(result).toBeTruthy();
    expect(result._id).toEqual(document.data._id);
  });

  test("should return fail object when fails", async () => {
    // Create Document
    const document = await createDocument(testModel, {});

    expect(document.success).toBeFalsy();
    expect(document.message).toBeTruthy();
    expect(document.data).toBe(null);
    expect(document.error).toBeTypeOf("object");
  });
});
