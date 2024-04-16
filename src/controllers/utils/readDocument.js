import { successResponse, errorResponse } from "#responses/response.js";

const readDocument = async (model, params) => {
  let result;
  try {
    result = await model.find(params);
  } catch (error) {
    return errorResponse(
      `Error finding documnet(s): ${error.message}`,
      error.statusCode || 500
    );
  }

  if (result.length === 0) {
    return errorResponse(`No documents found`, 404);
  }

  return successResponse(`Successfully returned documents`, 200, result);
};

export default readDocument;
