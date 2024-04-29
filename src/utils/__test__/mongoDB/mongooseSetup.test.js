import mongoose from "mongoose";

import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

describe("Database connect/disconnect functions", () => {
  // Init mongoDB variables
  let mongoConnection, mongoReplSet;

  beforeAll(async () => {
    // Connect to mongoDB
    ({ mongoConnection, mongoReplSet } = await connectDB());
  });

  afterAll(async () => {
    // Disconnect from mongoDB
    await disconnectDB(mongoConnection, mongoReplSet);
  });

  test("ConnectDB() should connect to mongod", () => {
    // Expect connection to be made
    expect(mongoConnection).toBeDefined();
    expect(mongoReplSet._state).toBe("running");
    expect(mongoose.connection.readyState).toBe(1);
  });

  test("DisconectDB() should disconnect from mongod", async () => {
    // Disconnect from DB
    await disconnectDB(mongoConnection, mongoReplSet);

    // Expect connection to be undefined after disconnect
    expect(mongoReplSet._state).toBe("stopped");
    expect(mongoose.connection.readyState).toBe(0);
  });
});
