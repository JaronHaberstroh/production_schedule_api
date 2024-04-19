import readDocument from "#controllers/utils/readDocument.js";
import Department from "#models/department.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const readDepartment = async (req, res, next) => {
  try {
    const departmentId = req.params._id;

    const params = departmentId ? { _id: departmentId } : {};

    const result = await readDocument(Department, params);

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
      `Error while fetching Department data: ${result.message}`,
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

export default readDepartment;
