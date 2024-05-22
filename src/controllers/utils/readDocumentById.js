import { successResponse, errorResponse } from "#responses/response";

const readDocumentById = async (Model, id) => {
  try {
    const document = await Model.findById(id);
    if (!document) {
      return errorResponse(`Error: ${Model.modelName} document not found`, 404);
    }

    return successResponse(
      `Successfully returned ${Model.modelName} document`,
      200,
      document,
    );
  } catch (error) {
    return errorResponse(
      error.message || `Error: Failed to find ${Model.modelName} document`,
      error.statusCode || 500,
    );
  }
};

export default readDocumentById;
