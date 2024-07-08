import createDocument from "#controllers/utils/createDocument.js";
import saveDocument from "#controllers/utils/saveDocument";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

const createDepartment = async (req, res, next) => {
  const departmentData = req.body;

  try {
    const document = createDocument(Department, departmentData);

    const result = await saveDocument(document);

    const error = handleResult(res, result);
    if (error) {
      return next(error);
    }
  } catch (error) {
    next(
      new AppError(
        `Unhandled Exception: ${error.message}`,
        error.statusCode || 500,
      ),
    );
  }
};

const handleResult = (res, result) => {
  if (!result.success) {
    return new AppError(
      `Error occured while saving Department document: ${result.message}`,
      result.statusCode || 500,
    );
  }

  res
    .status(201)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default createDepartment;
