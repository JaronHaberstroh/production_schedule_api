import * as productionLineService from "src/services/productionLine/productionLine.service";
import { successResponse } from "#responses/response";

export const createProductionLine = async (req, res, next) => {
  const { departmentId } = req.params;
  const productionLineParams = req.body;
  const session = req.session;

  const params = { ...productionLineParams, department: departmentId };

  const result = await productionLineService.addProductionLine(params, session);
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully created production line document",
    201,
    result,
  );
  res.status(201).json(response);
};

export const readProductionLine = async (req, res, next) => {
  const { departmentId, _id: productionLineId } = req.params;

  const params = {
    ...req.body,
    ...(departmentId && { department: departmentId }),
  };

  let result;
  if (productionLineId) {
    result =
      await productionLineService.fetchProductionLineById(productionLineId);
  } else {
    result = await productionLineService.fetchAllProductionLines(params);
  }

  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully retrieved production line documents",
    200,
    result,
  );
  res.status(200).json(response);
};

export const updateProductionLine = async (req, res, next) => {
  const { departmentId, _id: productionLineId } = req.params;
  const lineParams = req.body;
  const session = req.session;

  const params = {
    productionLineId,
    lineParams,
    oldDepartmentId: departmentId,
    ...(lineParams.department && { newDepartmentId: lineParams.department }),
  };

  const result = await productionLineService.editProductionLine(
    params,
    session,
  );
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully updated production line document",
    200,
    result,
  );
  res.status(200).json(response);
};

export const deleteProductionLine = async (req, res, next) => {
  const { departmentId, _id: productionLineId } = req.params;
  const session = req.session;

  const params = { departmentId, productionLineId };

  const result = await productionLineService.removeProductionLine(
    params,
    session,
  );
  if (result.error) return next(result.error);

  const response = successResponse(
    "Successfully deleted production line document",
    res.status,
    result,
  );
  res.status(200).json(response);
};
