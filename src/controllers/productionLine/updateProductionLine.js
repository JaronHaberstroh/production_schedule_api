import findDocumentById from "#controllers/utils/findDocumentById";
import saveDocument from "#controllers/utils/saveDocument";
import updateDocument from "#controllers/utils/updateDocument.js";
import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import AppError from "#utils/appError.js";
import { successResponse } from "#responses/response.js";

const updateProductionLine = async (req, res, next) => {
  const { departmentId, _id: productionLineId } = req.params;
  const { lineName, department: newDepartmentId } = req.body;
  const session = req.session;

  const params = {
    ...(newDepartmentId && { department: newDepartmentId }),
    ...(lineName && { lineName: lineName }),
  };

  try {
    const productionLine = await handleProductionLine(
      productionLineId,
      params,
      session,
    );

    if (productionLine.error) {
      const err = productionLine.error;
      throw new AppError(
        `Failed to update productionLine: ${err.message}`,
        err.statusCode || 500,
      );
    }

    if (newDepartmentId && newDepartmentId !== departmentId) {
      const oldDepartment = await handleOldDepartment(
        departmentId,
        productionLine,
        session,
      );
      if (oldDepartment.error) {
        const err = oldDepartment.error;
        throw new AppError(
          `Failed to update original department document: ${err.message}`,
          err.statusCode || 500,
        );
      }

      const newDepartment = await handleNewDepartment(
        newDepartmentId,
        productionLine,
        session,
      );
      if (newDepartment.error) {
        const err = newDepartment.error;
        throw new AppError(
          `Failed to update new department document: ${err.message}`,
          err.statusCode || 500,
        );
      }
    }

    res
      .status(200)
      .json(
        successResponse(
          productionLine.message,
          productionLine.statusCode,
          productionLine.data,
        ),
      );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    const err = new AppError(`Unhandled Exception: ${error.message}`, 500);
    return next(err);
  }
};

const handleProductionLine = async (id, params, session) => {
  const productionLine = await findDocumentById(ProductionLine, id);
  if (!productionLine.success) {
    return {
      error: new AppError(
        `Failed to find production line document: ${productionLine.message}`,
        productionLine.statusCode || 500,
      ),
    };
  }
  const productionLineDocument = productionLine.data;
  const updatedProductionLine = await updateDocument(
    productionLineDocument,
    params,
  );
  const savedProductionLine = await saveDocument(
    updatedProductionLine,
    session,
  );
  if (!savedProductionLine.success) {
    return {
      error: new AppError(
        `Failed to save old department: ${savedProductionLine.message}`,
        savedProductionLine.message || 500,
      ),
    };
  }
  return savedProductionLine.data;
};

const handleOldDepartment = async (id, productionLine, session) => {
  const oldDepartment = await findDocumentById(Department, id);
  if (!oldDepartment.success) {
    return {
      error: new AppError(
        `Failed to find old department document: ${oldDepartment.message}`,
        oldDepartment.statusCode || 500,
      ),
    };
  }
  const oldDepartmentDocument = oldDepartment.data;
  oldDepartmentDocument.productionLines.pull(productionLine);
  const oldDepartmentSaved = await saveDocument(oldDepartmentDocument, session);
  if (!oldDepartmentSaved.success) {
    return {
      error: new AppError(
        `Failed to save old department: ${oldDepartmentSaved.message}`,
        oldDepartmentSaved.message || 500,
      ),
    };
  }
  return oldDepartmentSaved.data;
};

const handleNewDepartment = async (id, productionLine, session) => {
  const newDepartment = await findDocumentById(Department, id);
  if (!newDepartment.success) {
    return {
      error: new AppError(
        `Failed to find new department document: ${newDepartment.message}`,
        newDepartment.statusCode || 500,
      ),
    };
  }
  const newDepartmentDocument = newDepartment.data;
  newDepartmentDocument.productionLines.push(productionLine);
  const newDepartmentSaved = await saveDocument(newDepartmentDocument, session);
  if (!newDepartmentSaved.success) {
    return {
      error: new AppError(
        `Failed to save old department: ${newDepartmentSaved.message}`,
        newDepartmentSaved.message || 500,
      ),
    };
  }
  return newDepartmentSaved.data;
};

export default updateProductionLine;
