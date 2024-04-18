import createDocument from "#controllers/utils/createDocument.js";
import Department from "#models/department.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const createDepartment = async (req, res, next) => {
  try {
    const departmentData = req.body;

    const result = await createDocument(Department, departmentData);

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
      `Error while saving Department document: ${result.message}`,
      result.statusCode || 500
    );
  }

  res
    .status(201)
    .json(successResponse(result.message, result.statusCode, result));
};

export default createDepartment;
