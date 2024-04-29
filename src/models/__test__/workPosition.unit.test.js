import WorkPosition from "#models/workPosition.js";
import mongoose from "mongoose";

describe("Work position model", () => {
  let testData;
  beforeAll(() => {
    testData = {
      positionName: "Test Position",
    };
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
