import * as departmentService from "src/services/department/department.service";
import { successResponse } from "#responses/response";

export const createDepartment = async (req, res, next) => {
  const params = req.body;

  const result = await departmentService.addDepartment(params);
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully saved new department document",
    201,
    result,
  );
  res.status(201).json(response);
};

export const readDepartment = async (req, res, next) => {
  const { _id: departmentId } = req.params;
  const params = req.body;

  let result;
  if (departmentId) {
    result = await departmentService.fetchDepartmentById(departmentId);
  } else {
    result = await departmentService.fetchAllDepartments(params);
  }

  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully retrieved department documents",
    200,
    result,
  );
  res.status(200).json(response);
};

export const updateDepartment = async (req, res, next) => {
  const { _id: departmentId } = req.params;
  const params = req.body;

  const result = await departmentService.editDepartment(departmentId, params);
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully updated department document",
    200,
    result,
  );
  res.status(200).json(response);
};

export const deleteDepartment = async (req, res, next) => {
  const { _id: departmentId } = req.params;

  const result = await departmentService.removeDepartment(departmentId);
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully deleted department document",
    200,
    result,
  );
  res.status(200).json(response);
};
