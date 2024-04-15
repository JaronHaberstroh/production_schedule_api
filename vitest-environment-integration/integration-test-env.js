import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

export default {
  name: "integration-env",
  transformMode: "ssr",
  async setup() {
    // Init DB variables
    let mongoConnection, mongoServer;

    // Connect to DB
    ({ mongoConnection, mongoServer } = await connectDB());

    globalThis.mongoConnection = mongoConnection;
    globalThis.mongoServer = mongoServer;
    return {
      async teardown() {
        // Disconnect from DB
        disconnectDB(mongoConnection, mongoServer);
      },
    };
  },
};
