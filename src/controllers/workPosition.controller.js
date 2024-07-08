import * as workPositionService from "src/services/workPosition/workPosition.service";
import { successResponse } from "#responses/response";

export const createWorkPosition = async (req, res, next) => {
  const params = req.body;

  const result = await workPositionService.addWorkPosition(params);
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully created new work position document",
    res.status,
    result,
  );
  res.status(201).json(response);
};

export const readWorkPosition = async (req, res, next) => {
  const id = req.params._id;
  const params = req.body.params;

  let result;
  if (id) {
    result = await workPositionService.fetchWorkPositionById(id);
  } else {
    result = await workPositionService.fetchAllWorkPositions(params);
  }
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully fetched work position documents",
    res.status,
    result,
  );
  res.status(200).json(response);
};

export const updateWorkPosition = async (req, res, next) => {
  const id = req.params._id;
  const params = req.body;

  const result = await workPositionService.editWorkPosition(id, params);
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully updated work position document",
    res.status,
    result,
  );
  res.status(200).json(response);
};

export const deleteWorkPosition = async (req, res, next) => {
  const id = req.params._id;

  const result = await workPositionService.removeWorkPosition(id);
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully deleted work position document",
    res.status,
    null,
  );
  res.status(200).json(response);
};
