import { connectDB, disconnectDB } from "#utils/mongoDB/mongooseSetup.js";
import readDocument from "../readDocument.js";

describe("readDocument()", () => {
  let mongoConnection, mongoReplSet;

  let testDocuments;
  beforeAll(async () => {
    ({ mongoConnection, mongoReplSet } = await connectDB());

    testDocuments = [
      { name: "Jane", age: 23, gender: "female" },
      { name: "Joe", age: 35, gender: "male" },
      { name: "John", age: 55, gender: "male" },
    ];
    await testModel.insertMany(testDocuments);
  });

  afterAll(async () => {
    await disconnectDB(mongoConnection, mongoReplSet);
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
});
