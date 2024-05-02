import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";
import mongoose from "mongoose";

export default {
  name: "integration-env",
  transformMode: "ssr",
  async setup() {
    // Init DB variables
    let mongoConnection, mongoReplSet;

    // Connect to DB
    ({ mongoConnection, mongoReplSet } = await connectDB());

    // Add connection to globalThis object
    globalThis.mongoConnection = mongoConnection;
    globalThis.mongoReplSet = mongoReplSet;

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
