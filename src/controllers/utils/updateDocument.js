import { successResponse, errorResponse } from "#responses/response.js";

const updateDocumment = async (model, params, session = undefined) => {
  const { query, params: updateParams } = params;

  try {
    const foundModel = await model.findById(query);
    if (!foundModel) {
      return errorResponse(`Failed to locate document matching query`, 404);
    }

    const updatedModel = Object.assign(foundModel, updateParams);

    const savedDocument = await updatedModel.save({ session });
    return handleSavedDocument(savedDocument);
  } catch (error) {
    return errorResponse(
      `Error updating document: ${error.message}`,
      error.statusCode || 500
    );
  }
};

export default updateDocumment;

const handleSavedDocument = (savedDocument) => {
  if (!savedDocument) {
    return errorResponse(`Document not modified`, 500);
  }

  return successResponse(`Successfully updated document`, 200, savedDocument);
};
