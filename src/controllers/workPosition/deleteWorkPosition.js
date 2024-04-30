import deleteDocument from "#controllers/utils/deleteDocument.js";
import WorkPosition from "#models/workPosition.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const deleteWorkPosition = async (req, res, next) => {
  try {
    const positionId = req.params._id;

    const result = await deleteDocument(WorkPosition, { _id: positionId });

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
      `Error while deleting Work Position document: ${result.message}`,
      result.statusCode || 500
    );
  }

  res
    .status(200)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default deleteWorkPosition;
