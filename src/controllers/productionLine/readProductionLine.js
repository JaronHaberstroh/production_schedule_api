import findDocuments from "#controllers/utils/findDocuments.js";
import ProductionLine from "#models/productionLine.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const readProductionLine = async (req, res, next) => {
  const { departmentId, _id: productionLineId } = req.params;

  try {
    const params = {
      ...(departmentId && { department: departmentId }),
      ...(productionLineId && { _id: productionLineId }),
    };

    const result = await findDocuments(ProductionLine, params);

    const error = handleResult(res, result);
    if (error) {
      next(error);
    }
  } catch (error) {
    const err = new AppError(
      `Unhandled Exception: ${error.message}`,
      error.statusCode || 500,
    );
    next(err);
  }
};

const handleResult = (res, result) => {
  if (!result.success) {
    return new AppError(
      `Failed to find production lines: ${result.message}`,
      result.statusCode || 500,
    );
  }

  res
    .status(200)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default readProductionLine;
