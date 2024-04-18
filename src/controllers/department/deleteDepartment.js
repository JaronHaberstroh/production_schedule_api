import deleteDocument from "#controllers/utils/deleteDocument.js";
import Department from "#models/department.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const deleteDepartment = async (req, res, next) => {
  try {
    const departmentId = req.params._id;

    const result = await deleteDocument(Department, { _id: departmentId });

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
      `Error while deleting Department document: ${result.message}`,
      result.statusCode || 500
    );
  }

  res
    .status(200)
    .json(successResponse(result.message, result.statusCode, result));
};

export default deleteDepartment;
