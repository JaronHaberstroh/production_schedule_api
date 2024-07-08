import { successResponse, errorResponse } from "#responses/response.js";

const findDocuments = async (model, params) => {
  try {
    const result = await model.find(params);
    return handleResult(result);
  } catch (error) {
    return errorResponse(
      error.message || "Error finding documents",
      error.statusCode || 500,
    );
  }
};

const handleResult = (result) => {
  if (result.length === 0) {
    return errorResponse("No documents returned from search", 404);
  }

  return successResponse("Successfully returned documents", 200, result);
};

export default findDocuments;
