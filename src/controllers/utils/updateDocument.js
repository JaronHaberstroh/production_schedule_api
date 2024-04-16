import { successResponse, errorResponse } from "#responses/response.js";

const updateDocumment = async (model, params) => {
  let result;
  try {
    result = await model.updateOne({ _id: params.query }, params.params);
  } catch (error) {
    return errorResponse(
      `Error updating document: ${error.message}`,
      error.statusCode || 500
    );
  }

  if (!result.matchedCount) {
    return errorResponse(`Failed to locate document matching query`, 404);
  }

  if (!result.modifiedCount) {
    return errorResponse(`No document modified`, 500);
  }

  return successResponse(`Successfully updated document`, 200, result);
};

export default updateDocumment;
