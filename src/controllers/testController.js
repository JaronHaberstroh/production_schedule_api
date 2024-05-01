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

  let departments = [];
  let productionLines = [];
  let workPositions = [];

  for (let i = 1; i <= 5; i++) {
    const department = new Department({
      departmentName: `Department ${i}`,
      productionLines: [],
    });
    departments.push(department);
  }

  for (let i = 0; i <= departments.length - 1; i++) {
    for (let j = 1; j <= 3; j++) {
      const productionLine = new ProductionLine({
        lineName: `Production Line ${j}`,
        department: departments[i]._id,
      });
      departments[i].productionLines.push(productionLine);
      productionLines.push(productionLine);
    }
  }

  for (let i = 0; i <= 5; i++) {
    const workPosition = new WorkPosition({
      positionName: `Position Name ${i}`,
    });
    workPositions.push(workPosition);
  }

  try {
    await Department.insertMany(departments);
    await ProductionLine.insertMany(productionLines);
    await WorkPosition.insertMany(workPositions);
    res.status(200).json(successResponse("DB seeding completed", 201));
  } catch (error) {
    const err = new AppError(`Error while seeding DB; ${error.message}`, 500);
    return next(err);
  }
};

const dropDB = async (req, res, next) => {
  try {
    await mongoose.connection.db.dropDatabase();
    res.status(200).json(successResponse("DB drop completed", 200));
  } catch (error) {
    const err = new AppError(`Error while dropping DB; ${error.message}`, 500);
    return next(err);
  }
};

export { seedDB, dropDB };
