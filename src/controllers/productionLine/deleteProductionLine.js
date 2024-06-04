import findDocumentById from "#controllers/utils/findDocumentById";
import deleteDocument from "#controllers/utils/deleteDocument";
import saveDocument from "#controllers/utils/saveDocument";
import ProductionLine from "#models/productionLine";
import Department from "#models/department";
import AppError from "#utils/appError";
import { successResponse } from "#responses/response";

const deleteProductionLine = async (req, res, next) => {
  const { departmentId, _id: productionLineId } = req.params;
  const session = req.session;

  try {
    const foundDepartment = await findDocumentById(Department, departmentId);
    if (!foundDepartment.success) {
      return next(
        new AppError(
          `Failed to find department: ${foundDepartment.message}`,
          foundDepartment.statusCode || 500,
        ),
      );
    }
    const departmentDocument = foundDepartment.data;
    departmentDocument.productionLines.pull(productionLineId);
    const savedDepartment = await saveDocument(departmentDocument, session);
    if (!savedDepartment.success) {
      return next(
        new AppError(
          `Failed to save department: $(savedDepartment.message}`,
          savedDepartment.statusCode || 500,
        ),
      );
    }

    const deletedProductionLine = await deleteDocument(
      ProductionLine,
      productionLineId,
      session,
    );
    if (!deletedProductionLine.success) {
      return next(
        new AppError(
          `Failed to delete production line: ${deletedProductionLine}`,
          deletedProductionLine.statusCode || 500,
        ),
      );
    }

    res
      .status(200)
      .json(successResponse("Successfully deleted productionLine", 200, null));
  } catch (error) {
    const err = new AppError(
      error.message || `Failed to delete ProductionLine`,
      error.statusCode || 500,
    );
    next(err);
  }
};

export default deleteProductionLine;
