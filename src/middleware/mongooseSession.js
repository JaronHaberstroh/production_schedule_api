import AppError from "#utils/AppError.js";
import mongoose from "mongoose";

const mongooseSession = (controller) => async (req, res, next) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    req.session = session;

    await controller(req, res, next);

    await session.commitTransaction();
  } catch (error) {
    const err = new AppError(
      `Session Error: ${error.message}`,
      error.status || 500,
    );

    next(err);
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

export default mongooseSession;
