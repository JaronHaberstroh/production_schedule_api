import { beforeAll } from "node_modules/vitest/dist/index";
import readDocumentById from "../readDocumentById";
import { connectDB, disconnectDB } from "#utils/mongoDB/mongooseSetup";

describe("readDocumentById()", () => {
  let testDocument;
  let mongoConnection, mongoReplSet;
  beforeAll(async () => {
    ({ mongoConnection, mongoReplSet } = await connectDB());

    const newDocument = new testModel(testData);
    testDocument = await newDocument.save();
  });

  afterAll(async () => {
    await disconnectDB(mongoConnection, mongoReplSet);
  });

  test("should return success response when successful", async () => {
    const result = await readDocumentById(testModel, testDocument.id);

    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(200);
    expect(result.message).toBeTruthy();
    expect(result.data).toBeTruthy();
    expect(result.error).toBe(null);
  });

  test("should return failure response when unsuccessful", async () => {
    const result = await readDocumentById(testModel, {});

    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(500);
    expect(result.message).toBeTruthy();
    expect(result.data).toBe(null);
    expect(result.error).toBeTypeOf("object");
  });
});
