export default {
  name: "express-env",
  transformMode: "ssr",
  async setup() {
    // Create mocks for Express objects and functions
    const mockReq = { body: {}, params: {} };
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
      async teardown() {},
    };
  },
};
