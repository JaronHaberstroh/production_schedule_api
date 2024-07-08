import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import WorkPosition from "#models/workPosition.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/AppError.js";
import mongoose from "mongoose";

const NUMBER_OF_DEPARTMENTS_TO_CREATE = 5;
const NUMBER_OF_PRODUCTION_LINES_TO_CREATE = 3;
const NUMBER_OF_WORK_POSITIONS_TO_CREATE = 5;

export const seedDB = async (req, res, next) => {
  if (process.env.NODE_ENV != "test") {
    const error = new AppError(
      `Path ${req.originalUrl} does not exist for ${req.method} method`,
      404,
    );
    return next(error);
  }

  const departments = createDepartmentsList();
  const workPositions = createWorkPositionsList();
  const productionLinesList = createProductionLinesList(departments);

  departments.forEach((department, i) => {
    department.productionLines = productionLinesList.slice(
      i * NUMBER_OF_PRODUCTION_LINES_TO_CREATE, // Find start position
      (i + 1) * NUMBER_OF_PRODUCTION_LINES_TO_CREATE, // Find end position
    );
  });

  try {
    await Promise.all([
      Department.insertMany(departments),
      WorkPosition.insertMany(workPositions),
      ProductionLine.insertMany(productionLinesList),
    ]);

    const response = successResponse("Successfully populated DB", 201);
    res.status(200).json(response);
  } catch (error) {
    const err = new AppError(`Error while seeding DB; ${error.message}`, 500);
    return next(err);
  }
};

export const dropDB = async (req, res, next) => {
  if (process.env.NODE_ENV != "test") {
    const error = new AppError(
      `Path ${req.originalUrl} does not exist for ${req.method} method`,
      404,
    );
    return next(error);
  }

  try {
    await mongoose.connection.db.dropDatabase();

    const response = successResponse("Successfully dropped DB", 200);
    res.status(200).json(response);
  } catch (error) {
    const err = new AppError(`Error while dropping DB; ${error.message}`, 500);
    return next(err);
  }
};

const createDepartmentsList = () => {
  return Array.from(
    { length: NUMBER_OF_DEPARTMENTS_TO_CREATE },
    (_, i) =>
      new Department({
        departmentName: `Department ${i + 1}`,
        productionLines: [],
      }),
  );
};

const createWorkPositionsList = () => {
  return Array.from(
    { length: NUMBER_OF_WORK_POSITIONS_TO_CREATE },
    (_, i) =>
      new WorkPosition({
        positionName: `Position Name ${i + 1}`,
      }),
  );
};

const createProductionLinesList = (departmentList) => {
  return departmentList
    .map((department, i) =>
      Array.from(
        { length: NUMBER_OF_PRODUCTION_LINES_TO_CREATE },
        (_, j) =>
          new ProductionLine({
            lineName: `Production Line${i} ${j}`,
            department: department._id,
          }),
      ),
    )
    .flat();
};
