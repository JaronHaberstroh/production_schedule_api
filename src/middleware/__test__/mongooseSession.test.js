// @vitest-environment express

import mongooseSession from "../mongooseSession.js";
import AppError from "#utils/appError.js";
import mongoose, { startSession } from "mongoose";

vi.mock("mongoose", () => ({
  default: {
    startSession: vi.fn(),
    commitTransaction: vi.fn(),
    abortTransaction: vi.fn(),
    endSession: vi.fn(),
  },
}));

vi.mock("#utils/appError.js", () => ({ default: vi.fn() }));

describe("Mongoose session wrapper", () => {
  const controller = vi.fn();
  const session = {
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    abortTransaction: vi.fn(),
    endSession: vi.fn(),
  };

  test("should start, commit, and end session on successful transaction", async () => {
    mongoose.startSession.mockResolvedValueOnce(session);
    await mongooseSession(controller)(mockReq, mockRes, mockNext);

    expect(session.startTransaction).toBeCalled();
    expect(mockReq.session).toBe(session);
    expect(controller).toBeCalledWith(mockReq, mockRes, mockNext);
    expect(session.commitTransaction).toBeCalled();
    expect(session.endSession).toBeCalled();
    expect(mockNext).not.toBeCalled();
  });

  test("should abort session and pass error to next on transaction error", async () => {
    const error = new Error("test error", 500);
    mongoose.startSession.mockResolvedValueOnce(session);
    controller.mockRejectedValueOnce(error);
    await mongooseSession(controller)(mockReq, mockRes, mockNext);

    expect(session.startTransaction).toBeCalled();
    expect(mockReq.session).toBe(session);
    expect(controller).toBeCalledWith(mockReq, mockRes, mockNext);
    expect(session.abortTransaction).toBeCalled();
    expect(AppError).toBeCalledWith(`Session Error: ${error.message}`, 500);
    expect(mockNext).toBeCalledWith(expect.any(AppError));
    expect(session.endSession).toBeCalled();
  });
});
