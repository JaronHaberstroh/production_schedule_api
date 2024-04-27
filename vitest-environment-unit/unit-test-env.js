import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

export default {
  name: "unit-env",
  transformMode: "ssr",
  async setup() {
    // Init DB variables
    let mongoConnection, mongoServer;

    // Connect to DB
    ({ mongoConnection, mongoServer } = await connectDB());

    // Create mocks for Express objects and functions
    const mockReq = { body: {}, params: {}, session: {} };
    const mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn(() => mockRes),
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
