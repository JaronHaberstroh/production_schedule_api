import { errorResponse, successResponse } from "#responses/response";

const findOneDocument = async (Model, params) => {
  try {
    const document = await Model.findOne(params);
    return handleDocument(document);
  } catch (error) {
    return errorResponse(
      error.message || "Error while searching for document",
      error.statusCode || 500,
    );
  }
};

const handleDocument = (document) => {
  if (!document) {
    return errorResponse("Document not found", 404);
  }

  return successResponse("Successfully found document", 200, document);
};
export default findOneDocument;
