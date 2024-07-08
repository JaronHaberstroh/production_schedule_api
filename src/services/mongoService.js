import AppError from "#utils/AppError";

export const createDocument = (Model, params) => {
  return new Model(params);
};

export const findDocumentById = async (Model, id) => {
  const document = await Model.findById(id);

  if (!document) {
    throw new AppError("Error: No document returned from search", 404);
  }

  return document;
};

export const findDocument = async (Model, params) => {
  const results = await Model.find(params);

  if (results.length === 0) {
    throw new AppError("Error: No documents returned from search", 404);
  }

  return results;
};

export const updateDocument = (document, params) => {
  return Object.assign(document, params);
};

export const deleteDocument = async (Model, params, session = undefined) => {
  const result = await Model.deleteOne(params, { session });

  if (!result.deletedCount) {
    throw new AppError("Error: Document deleted count false", 500);
  }
};

export const saveDocument = async (document, session = undefined) => {
  const result = await document.save({ session });

  if (!result) {
    throw new AppError("Error: Failed to save document", 500);
  }

  return result;
};
