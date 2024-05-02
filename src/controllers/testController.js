import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import WorkPosition from "#models/workPosition.js";
import { successResponse } from "#responses/response.js";
import AppError from "#utils/appError.js";
import mongoose from "mongoose";

const seedDB = async (req, res, next) => {
  if (process.env.NODE_ENV != "test") {
    const error = new AppError(
      `Path ${req.originalUrl} does not exist for ${req.method} method`,
      404
    );
    return next(error);
  }

  const workPositions = createWorkPositionsList(5);

  const departments = createDepartmentsList(5);

  const productionLinesList = createProductionLinesList(departments, 3);

  for (let i = 0; i <= 5; i++) {
    const workPosition = new WorkPosition({
      positionName: `Position Name ${i}`,
    });
    workPositions.push(workPosition);
  }

  try {
    await Promise.all([
      Department.insertMany(departments),
      WorkPosition.insertMany(workPositions),
      ProductionLine.insertMany(productionLinesList),
    ]);
    res.status(200).json(successResponse("DB seeding completed", 201));
  } catch (error) {
    const err = new AppError(`Error while seeding DB; ${error.message}`, 500);
    return next(err);
  }
};

const dropDB = async (req, res, next) => {
  if (process.env.NODE_ENV != "test") {
    const error = new AppError(
      `Path ${req.originalUrl} does not exist for ${req.method} method`,
      404
    );
    return next(error);
  }

  try {
    await mongoose.connection.db.dropDatabase();
    res.status(200).json(successResponse("DB drop completed", 200));
  } catch (error) {
    const err = new AppError(`Error while dropping DB; ${error.message}`, 500);
    return next(err);
  }
};

const createDepartmentsList = (num) => {
  return Array.from(
    { length: num },
    (_, i) =>
      new Department({
        departmentName: `Department ${i + 1}`,
        productionLines: [],
      })
  );
};

const createWorkPositionsList = (num) => {
  return Array.from(
    { length: num },
    (_, i) =>
      new WorkPosition({
        positionName: `Position Name ${i + 1}`,
      })
  );
};

const createProductionLinesList = (num, departmentList) => {
  return departmentList
    .map((department, i) =>
      Array.from(
        { length: num },
        (_, j) =>
          new ProductionLine({
            lineName: `Production Line${i} ${j}`,
            department: department._id,
          })
      )
    )
    .flat();
};

export { seedDB, dropDB };
