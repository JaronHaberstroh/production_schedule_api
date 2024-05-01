import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";
import mongoose from "mongoose";

export default {
  name: "unit-env",
  transformMode: "ssr",
  async setup() {
    // Init DB variables
    let mongoConnection, mongoReplSet;

    // Connect to DB
    ({ mongoConnection, mongoReplSet } = await connectDB());

    // Create mocks for Express objects and functions
    const mockReq = { body: {}, params: {}, session: {} };
    const mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn(() => mockRes),
      headersSent: false,
    };
    const mockNext = vi.fn();

    generateTestData();

    // Add Express mocks to globalThis object
    globalThis.mockReq = mockReq;
    globalThis.mockRes = mockRes;
    globalThis.mockNext = mockNext;

    return {
      async teardown() {
        // Drop DB
        await mongoose.connection.db.dropDatabase();

        // Disconnect from DB
        await disconnectDB(mongoConnection, mongoReplSet);
      },
    };
  },
};

const generateTestData = () => {
  // Create test data
  let data = {
    name: "John Doe",
    age: 60,
    gender: "male",
  };

  // Create test schema
  const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name field required"] },
    age: { type: Number, required: [true, "Age field required"] },
    gender: { type: String, required: false },
  });

  // Create test model
  const User = mongoose.model("User", userSchema);

  // Add test variables to globalThis object
  globalThis.testModel = User;
  globalThis.testData = data;
};
