import createDocument from "#controllers/utils/createDocument.js";
import WorkPosition from "#models/workPosition.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const createWorkPosition = async (req, res, next) => {
  try {
    const positionData = req.body;

    const result = await createDocument(WorkPosition, positionData);

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
      `Error while saving Work Position document: ${result.message}`,
      result.statusCode || 500
    );
  }

  res
    .status(201)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default createWorkPosition;
