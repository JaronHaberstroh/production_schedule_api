import findDocumentById from "#controllers/utils/findDocumentById";
import updateDocumment from "#controllers/utils/updateDocument.js";
import saveDocument from "#controllers/utils/saveDocument";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

const updateDepartment = async (req, res, next) => {
  const departmentId = req.params._id;
  const params = req.body;

  try {
    const document = await findDocumentById(Department, departmentId);
    if (!document.success) {
      return next(
        new AppError(
          `Failed to find department document : ${document.message}`,
          document.statusCode || 404,
        ),
      );
    }

    const updatedDocument = await updateDocumment(document.data, params);

    const result = await saveDocument(updatedDocument);
    handleResult(res, result);
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
      `Error while updating Department document: ${result.message}`,
      result.statusCode || 500,
    );
  }

  res
    .status(200)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default updateDepartment;
