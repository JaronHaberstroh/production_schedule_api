import WorkPosition from "#models/workPosition";
import * as mongoService from "../mongoService";
import serviceErrorHandler from "../utils/serviceErrorHandler";
export const addWorkPosition = async (params, session = undefined) => {
  try {
    const document = await mongoService.createDocument(WorkPosition, params);

    return await mongoService.saveDocument(document, session);
  } catch (error) {
    return serviceErrorHandler(WorkPosition, error);
  }
};

export const fetchAllWorkPositions = async (params = {}) => {
  try {
    return await mongoService.findDocument(WorkPosition, params);
  } catch (error) {
    return serviceErrorHandler(WorkPosition, error);
  }
};

export const fetchWorkPositionById = async (workPositionId) => {
  try {
    return await mongoService.findDocumentById(WorkPosition, workPositionId);
  } catch (error) {
    return serviceErrorHandler(WorkPosition, error);
  }
};

export const editWorkPosition = async (
  workPositionId,
  params,
  session = undefined,
) => {
  try {
    const document = await mongoService.findDocumentById(
      WorkPosition,
      workPositionId,
    );

    const updatedDocument = mongoService.updateDocument(document, params);

    return await mongoService.saveDocument(updatedDocument, session);
  } catch (error) {
    return serviceErrorHandler(WorkPosition, error);
  }
};

export const removeWorkPosition = async (
  workPositionId,
  session = undefined,
) => {
  try {
    await mongoService.deleteDocument(
      WorkPosition,
      { _id: workPositionId },
      session,
    );
    return {};
  } catch (error) {
    return serviceErrorHandler(WorkPosition, error);
  }
};
