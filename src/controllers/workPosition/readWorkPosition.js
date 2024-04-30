import readDocument from "#controllers/utils/readDocument.js";
import WorkPosition from "#models/workPosition.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const readWorkPosition = async (req, res, next) => {
  try {
    const positionId = req.params._id;

    const params = positionId ? { _id: positionId } : {};

    const result = await readDocument(WorkPosition, params);

    const error = handleResult(res, result);
    if (error) {
      return next(error);
    }
  } catch (error) {
    next(
      new AppError(
        `Unhandled Exception: ${error.message}`,
        error.statusCode || 500
      )
    );
  }
};

const handleResult = (res, result) => {
  if (result.error) {
    return new AppError(
      `Error while fetching Work Position data: ${result.message}`,
      result.statusCode || 500
    );
  }

  if (result.data.length === 0) {
    return new AppError(`No data returned from search:`, 404);
  }

  res
    .status(200)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default readWorkPosition;
