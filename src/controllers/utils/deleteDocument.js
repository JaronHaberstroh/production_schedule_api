import { successResponse, errorResponse } from "#responses/response.js";

const deleteDocument = async (model, params) => {
  let result;
  try {
    result = await model.deleteOne(params);
  } catch (error) {
    return errorResponse(
      `Error deleting document: ${error.message}`,
      error.statusCode || 500
    );
  }

  if (!result.deletedCount) {
    return errorResponse(`Document not deleted`, 500);
  }

  return successResponse(`Successfully deleted document`, 200, result);
};

export default deleteDocument;
