import findDocumentById from "#controllers/utils/findDocumentById";
import createDocument from "#controllers/utils/createDocument";
import saveDocument from "#controllers/utils/saveDocument";
import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const createProductionLine = async (req, res, next) => {
  const { departmentId } = req.params;
  const productionLineData = req.body;
  const session = req.session;

  try {
    // Create and save production line
    const productionLineDocument = createDocument(
      ProductionLine,
      productionLineData,
    );
    const savedProductionLine = await saveDocument(
      productionLineDocument,
      session,
    );
    if (!savedProductionLine.success) {
      return next(
        new AppError(
          `Failed to save production line: ${savedProductionLine.message}`,
          savedProductionLine.statusCode || 500,
        ),
      );
    }

    // Update and save department
    const foundDepartment = await findDocumentById(Department, departmentId);
    if (!foundDepartment) {
      return next(
        new AppError(
          `Failed to find department: ${foundDepartment.message}`,
          foundDepartment.statusCode || 500,
        ),
      );
    }
    const departmentDocument = foundDepartment.data;
    departmentDocument.productionLines.push(productionLineDocument);
    const savedDepartment = await saveDocument(departmentDocument, session);
    if (!savedDepartment.success) {
      return next(
        new AppError(
          `Failed to save department: ${savedDepartment.message}`,
          savedDepartment.statusCode || 500,
        ),
      );
    }

    res
      .status(201)
      .json(
        successResponse(
          `Production line created successfully`,
          201,
          savedProductionLine,
        ),
      );
  } catch (error) {
    const err = new AppError(
      `Unhandled Exception: ${error.message}`,
      error.statusCode || 500,
    );
    return next(err);
  }
};

export default createProductionLine;
