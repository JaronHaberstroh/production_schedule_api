import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";
import mongoose from "mongoose";

export default {
  name: "mongo-env",
  transformMode: "ssr",
  async setup() {
    // Init DB variables
    let mongoConnection, mongoServer;

    // Connect to DB
    ({ mongoConnection, mongoServer } = await connectDB());

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

    return {
      async teardown() {
        // Disconnect from DB
        disconnectDB(mongoConnection, mongoServer);
      },
    };
  },
};
