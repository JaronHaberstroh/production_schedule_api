import WorkPosition from "#models/workPosition.js";
import { connectDB, disconnectDB } from "#utils/mongoDB/mongooseSetup.js";
import mongoose from "mongoose";

describe("Work position model", () => {
  let mongoConnection, mongoReplSet;

  let testData;
  beforeAll(async () => {
    ({ mongoConnection, mongoReplSet } = await connectDB());

    testData = {
      positionName: "Test Position",
    };
  });

  afterAll(async () => {
    await WorkPosition.deleteMany();

    await disconnectDB(mongoConnection, mongoReplSet);
  });

  test("should create and save work position successfully", async () => {
    const validPosition = new WorkPosition(testData);

    const savedPosition = await validPosition.save();

    expect(savedPosition._id).toBeDefined();
    expect(savedPosition.positionName).toBe(testData.positionName);
  });

  test("shouldn't be able to insert undefined fields", async () => {
    const positionWithInvalidField = new WorkPosition({
      ...testData,
      invalidField: "invalid",
    });

    const savedPosition = await positionWithInvalidField.save();

    expect(savedPosition._id).toBeDefined();
    expect(savedPosition.invalidField).toBeUndefined();
  });

  test("should fail when required fields not provided", () => {
    const positionWithoutRequiredField = new WorkPosition({});

    const savePosition = async () => {
      await positionWithoutRequiredField.save();
    };

    expect(savePosition).rejects.toThrowError(mongoose.Error.ValidationError);
  });
});
