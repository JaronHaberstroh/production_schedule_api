import mongoose from "mongoose";

import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

describe("Database connect/disconnect functions", () => {
  // Init mongoDB variables
  let mongoConnection, mongoServer;

  beforeAll(async () => {
    // Connect to mongoDB
    ({ mongoConnection, mongoServer } = await connectDB());
  });

  afterAll(async () => {
    // Disconnect from mongoDB
    await disconnectDB(mongoConnection, mongoServer);
  });

  test("ConnectDB() should connect to mongod", () => {
    // Expect connection to be made
    expect(mongoConnection).toBeDefined();
    expect(mongoServer._instanceInfo).toBeTruthy();
    expect(mongoose.connection.readyState).toBe(1);
  });

  test("DisconectDB() should disconnect from mongod", async () => {
    // Disconnect from DB
    await disconnectDB(mongoConnection, mongoServer);

    // Expect connection to be undefined after disconnect
    expect(mongoServer._instanceInfo).toBe(undefined);
    expect(mongoose.connection.readyState).toBe(0);
  });
});
