import updateDocumment from "#controllers/utils/updateDocument.js";
import WorkPosition from "#models/workPosition.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const updateWorkPosition = async (req, res, next) => {
  try {
    const positionId = req.params._id;
    const params = req.body;

    const result = await updateDocumment(WorkPosition, {
      query: positionId,
      params: params,
    });

    handleResult(next, res, result);
  } catch (error) {
    next(
      new AppError(
        `Unhandled Exception: ${error.message}`,
        error.statusCode || 500
      )
    );
  }
};

const handleResult = (next, res, result) => {
  if (result.error) {
    return next(
      new AppError(
        `Error while updating Work Position document: ${result.message}`,
        result.statusCode || 500
      )
    );
  }

  res
    .status(200)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default updateWorkPosition;
