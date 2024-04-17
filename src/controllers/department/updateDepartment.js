import updateDocumment from "#controllers/utils/updateDocument.js";
import Department from "#models/department.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const updateDepartment = async (req, res, next) => {
  try {
    const departmentId = req.params._id;
    const params = req.body;

    validateDepartmentData(next, departmentId, params);

    const result = await updateDocumment(Department, {
      query: departmentId,
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

const validateDepartmentData = (next, departmentId, params) => {
  if (!departmentId) {
    return next(new AppError(`Department id is required`, 400));
  }

  if (Object.keys(params).length === 0) {
    return next(
      new AppError(`Update requires changed properties be provided`, 400)
    );
  }
};

const handleResult = (next, res, result) => {
  if (result.error) {
    return next(
      new AppError(
        `Error while updating Department document: ${result.message}`,
        result.statusCode || 500
      )
    );
  }

  res
    .status(200)
    .json(successResponse(result.message, result.statusCode, result));
};

export default updateDepartment;
