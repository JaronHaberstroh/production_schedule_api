import Department from "#models/department.js";
import { connectDB, disconnectDB } from "#utils/mongoDB/mongooseSetup.js";
import mongoose from "mongoose";

describe("Department Model", () => {
  let mongoConnection, mongoReplSet;

  let testData;
  beforeAll(async () => {
    ({ mongoConnection, mongoReplSet } = await connectDB());

    testData = {
      departmentName: "testDepartment",
    };
  });

  afterAll(async () => {
    await Department.deleteMany();

    await disconnectDB(mongoConnection, mongoReplSet);
  });

  test("should create and save department successfully", async () => {
    // Create valid department
    const validDepartment = new Department(testData);

    // Save valid department to DB
    const savedDepartment = await validDepartment.save();

    // Expect department data to be in DB
    expect(savedDepartment._id).toBeDefined();
    expect(savedDepartment.departmentName).toBe(testData.departmentName);
  });

  test("shouldn't be able to insert undefined fields", async () => {
    // Create valid department
    const departmentWithInvalidField = new Department({
      ...testData,
      invalidField: "invalid",
    });

    // Save department to DB
    const savedDepartment = await departmentWithInvalidField.save();

    // Expect department to be in DB, but invalid field to be omitted
    expect(savedDepartment._id).toBeDefined();
    expect(savedDepartment.invalidField).toBeUndefined();
  });

  test("should fail when required fields not provided", () => {
    // Create department without required departmentName
    const departmentWithoutRequiredField = new Department({});

    const saveDepartment = async () => {
      await departmentWithoutRequiredField.save();
    };

    expect(saveDepartment).rejects.toThrowError(mongoose.Error.ValidationError);
  });
});
