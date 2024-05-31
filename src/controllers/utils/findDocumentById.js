import { successResponse, errorResponse } from "#responses/response";

const findDocumentById = async (Model, id) => {
  try {
    const document = await Model.findById(id);
    return handleDocument(document);
  } catch (error) {
    return errorResponse(
      error.message || "Error occured while searching for document",
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

export default findDocumentById;
