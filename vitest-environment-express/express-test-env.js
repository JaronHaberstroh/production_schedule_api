import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

export default {
  name: "express-env",
  transformMode: "ssr",
  async setup() {
    // Init DB variables
    let mongoConnection, mongoServer;

    // Connect to DB
    ({ mongoConnection, mongoServer } = await connectDB());

    // Create mocks for Express objects and functions
    const mockReq = {};
    const mockRes = {
      status: vi.fn(),
      json: vi.fn(),
      headersSent: false,
    };
    const mockNext = vi.fn();

    // Add Express mocks to globalThis object
    globalThis.mockReq = mockReq;
    globalThis.mockRes = mockRes;
    globalThis.mockNext = mockNext;

    return {
      async teardown() {
        // Disconnect from DB
        disconnectDB(mongoConnection, mongoServer);
      },
    };
  },
};
