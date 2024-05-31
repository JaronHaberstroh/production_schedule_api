import { successResponse, errorResponse } from "#responses/response.js";

const deleteDocument = async (model, params, session = undefined) => {
  try {
    const result = await model.deleteOne(params, { session });
    return handleResult(result);
  } catch (error) {
    return errorResponse(
      error.message || "Error occured while deleting document",
      error.statusCode || 500,
    );
  }
};

const handleResult = (result) => {
  if (!result.deletedCount) {
    return errorResponse("Failed to delete document", 500);
  }

  return successResponse("Document successfully deleted", 200, result);
};

export default deleteDocument;
