import Department from "#models/department";
import * as mongoService from "../mongoService";
import serviceErrorHandler from "../utils/serviceErrorHandler";

export const addDepartment = async (params, session = undefined) => {
  try {
    const document = mongoService.createDocument(Department, params);

    return await mongoService.saveDocument(document, session);
  } catch (error) {
    return serviceErrorHandler(Department, error);
  }
};

export const fetchAllDepartments = async (params = {}) => {
  try {
    return await mongoService.findDocument(Department, params);
  } catch (error) {
    return serviceErrorHandler(Department, error);
  }
};

export const fetchDepartmentById = async (departmentId) => {
  try {
    return await mongoService.findDocumentById(Department, departmentId);
  } catch (error) {
    return serviceErrorHandler(Department, error);
  }
};

export const editDepartment = async (
  departmentId,
  params,
  session = undefined,
) => {
  try {
    const document = await mongoService.findDocumentById(
      Department,
      departmentId,
    );

    const updatedDocument = mongoService.updateDocument(document, params);

    return await mongoService.saveDocument(updatedDocument, session);
  } catch (error) {
    return serviceErrorHandler(Department, error);
  }
};

export const removeDepartment = async (departmentId, session = undefined) => {
  try {
    await mongoService.deleteDocument(
      Department,
      { _id: departmentId },
      session,
    );
    return {};
  } catch (error) {
    return serviceErrorHandler(Department, error);
  }
};
