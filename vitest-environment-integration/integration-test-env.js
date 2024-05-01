import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

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
        // Disconnect from DB
        disconnectDB(mongoConnection, mongoReplSet);
      },
    };
  },
};
