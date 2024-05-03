import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";

const createProductionLine = async (req, res, next) => {
  const { departmentId } = req.params;
  const { lineName } = req.body;
  const session = req.session;

  let savedProductionLine;
  try {
    // Add production line
    const params = { lineName, department: departmentId };
    const productionLine = new ProductionLine(params);
    savedProductionLine = await productionLine.save({ session });

    // Update Department
    const department = await Department.findOne({ _id: departmentId });
    department.productionLines.push(savedProductionLine._id);
    await department.save({ session });
  } catch (error) {
    const err = new AppError(
      `Unhandled Exception: ${error.message}`,
      error.statusCode || 500
    );
    return next(err);
  }

  res
    .status(201)
    .json(
      successResponse(
        `Production line created successfully`,
        201,
        savedProductionLine
      )
    );
};

export default createProductionLine;
