import Department from "#models/department";
import { findDocumentById, saveDocument } from "../mongoService";
import serviceErrorHandler from "../utils/serviceErrorHandler";

export const pushToProductionLines = async (
  departmentId,
  productionLineId,
  session = undefined,
) => {
  try {
    const document = await findDocumentById(Department, departmentId);

    document.productionLines.push(productionLineId);

    return await saveDocument(document, session);
  } catch (error) {
    return serviceErrorHandler(Department, error);
  }
};

export const pullFromProductionLines = async (
  departmentId,
  productionLineId,
  session = undefined,
) => {
  try {
    const document = await findDocumentById(Department, departmentId);

    document.productionLines.pull(productionLineId);

    return await saveDocument(document, session);
  } catch (error) {
    return serviceErrorHandler(Department, error);
  }
};
