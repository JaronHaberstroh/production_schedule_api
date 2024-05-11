import updateDocumment from "#controllers/utils/updateDocument.js";
import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import { errorResponse, successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const updateProductionLine = async (req, res, next) => {
  const { departmentId, _id: productionLineId } = req.params;
  const { lineName, department: newDepartmentId } = req.body;
  const session = req.session;

  try {
    const params = {};
    if (newDepartmentId) params.department = newDepartmentId;
    if (lineName) params.lineName = lineName;

    const productionLine = await updateDocumment(
      ProductionLine,
      { query: productionLineId, params: params },
      session
    );
    if (productionLine.error) {
      return next(productionLine.error);
    }

    if (newDepartmentId && newDepartmentId !== departmentId) {
      const oldDepartment = await updateDepartmentProductionLineArray(
        departmentId,
        productionLineId,
        "pull",
        session
      );
      if (oldDepartment.error) {
        return next(oldDepartment.error);
      }

      const newDepartment = await updateDepartmentProductionLineArray(
        newDepartmentId,
        productionLineId,
        "push",
        session
      );
      if (newDepartment.error) {
        return next(newDepartment.error);
      }
    }

    res
      .status(200)
      .json(
        successResponse(
          productionLine.message,
          productionLine.statusCode,
          productionLine.data
        )
      );
  } catch (error) {
    const err = new AppError(`Unhandled Exception: ${error.message}`, 500);
    return next(err);
  }
};

const updateDepartmentProductionLineArray = async (
  departmentId,
  productionLineId,
  action,
  session
) => {
  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return errorResponse(
        `Unable to find document ${error.message}`,
        error.statusCode || 500
      );
    }

    switch (action) {
      case "pull":
        department.productionLines.pull(productionLineId);
        break;
      case "push":
        department.productionLines.push(productionLineId);
        break;
      default:
        return errorResponse(`Action not provided`, 500);
    }

    const updatedDepartment = await department.save({ session });
    if (!updatedDepartment) {
      return errorResponse(`Failed to update Document`, 500);
    }

    return updatedDepartment;
  } catch (error) {
    return errorResponse(
      `Unhandled Error: ${error.message}`,
      error.statusCode || 500
    );
  }
};

export default updateProductionLine;
