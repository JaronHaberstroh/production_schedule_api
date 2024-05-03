import readDocument from "#controllers/utils/readDocument.js";
import ProductionLine from "#models/productionLine.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const readProductionLine = async (req, res, next) => {
  try {
    const productionLineId = req.params._id;

    const params = productionLineId ? { _id: productionLineId } : {};

    const result = await readDocument(ProductionLine, params);

    const error = handleResult(res, result);
    if (error) {
      return next(error);
    }
  } catch (error) {
    const err = new AppError(
      `Unhandled Exception: ${error.message}`,
      error.statusCode || 500
    );
    next(err);
  }
};

const handleResult = (res, result) => {
  if (result.error) {
    return new AppError(
      `Error while fetching Production Line data: ${result.message}`,
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

export default readProductionLine;
