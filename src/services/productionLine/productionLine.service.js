import ProductionLine from "#models/productionLine";
import * as mongoService from "../mongoService";
import { fetchDepartmentById } from "../department/department.service";
import {
  pushToProductionLines,
  pullFromProductionLines,
} from "../department/productionLinesList";
import serviceErrorHandler from "../utils/serviceErrorHandler";

// TODO: Separate departmentService calls into their own file and call here

export const addProductionLine = async (params, session) => {
  try {
    const { department: departmentId } = params;

    const document = mongoService.createDocument(ProductionLine, params);
    const productionLineId = document._id;

    const productionLine = await mongoService.saveDocument(document, session);

    const department = await pushToProductionLines(
      departmentId,
      productionLineId,
      session,
    );
    if (department.error) throw department.error;

    return {
      productionLine: productionLine,
      department: department,
    };
  } catch (error) {
    return serviceErrorHandler(ProductionLine, error);
  }
};

export const fetchAllProductionLines = async (params = {}) => {
  try {
    return await mongoService.findDocument(ProductionLine, params);
  } catch (error) {
    return serviceErrorHandler(ProductionLine, error);
  }
};

export const fetchProductionLineById = async (productionLineId) => {
  try {
    return await mongoService.findDocumentById(
      ProductionLine,
      productionLineId,
    );
  } catch (error) {
    return serviceErrorHandler(ProductionLine, error);
  }
};

export const fetchProductionLinesByDepartment = async (departmentId) => {
  try {
    const department = await fetchDepartmentById(departmentId);
    if (department.error) return department.error;

    const productionLinesList = department.productionLines;

    return await productionLinesList.map(async (lineId) => {
      await fetchProductionLineById(lineId);
    });
  } catch (error) {
    return serviceErrorHandler(ProductionLine, error);
  }
};

export const editProductionLine = async (params, session) => {
  try {
    const { productionLineId, lineParams } = params;

    const productionLine = await mongoService.findDocumentById(
      ProductionLine,
      productionLineId,
    );
    const updatedProductionLine = mongoService.updateDocument(
      productionLine,
      lineParams,
    );
    const savedProductionLine = await mongoService.saveDocument(
      updatedProductionLine,
      session,
    );

    const department = await updateDepartmentDocuments(params, session);
    if (department.error) throw department.error;

    return {
      productionLine: savedProductionLine,
      department: department || "Department document unchanged",
    };
  } catch (error) {
    return serviceErrorHandler(ProductionLine, error);
  }
};

export const removeProductionLine = async (params, session) => {
  try {
    const { departmentId, productionLineId } = params;

    const productionLine = await mongoService.deleteDocument(
      ProductionLine,
      { _id: productionLineId },
      session,
    );

    const department = await pullFromProductionLines(
      departmentId,
      productionLineId,
      session,
    );
    if (department.error) throw department.error;

    return {
      productionLine: productionLine || {},
      department: department,
    };
  } catch (error) {
    return serviceErrorHandler(ProductionLine, error);
  }
};

const updateDepartmentDocuments = async (params, session) => {
  const { oldDepartmentId, newDepartmentId, productionLineId } = params;

  if (!newDepartmentId && newDepartmentId === oldDepartmentId) {
    return;
  }

  const oldDepartment = await pullFromProductionLines(
    oldDepartmentId,
    productionLineId,
    session,
  );
  if (oldDepartment.error) throw oldDepartment.error;

  const newDepartment = await pushToProductionLines(
    newDepartmentId,
    productionLineId,
    session,
  );
  if (newDepartment.error) throw newDepartment.error;

  return [oldDepartment, newDepartment];
};
