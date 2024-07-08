import { errorResponse, successResponse } from "#responses/response";

const saveDocument = async (document, session = undefined) => {
  try {
    const result = await document.save({ session });

    return handleSavedDocument(result);
  } catch (error) {
    return errorResponse(
      error.message || "Error occured while saving document",
      error.statusCode || 500,
    );
  }
};

const handleSavedDocument = (result) => {
  if (!result) {
    return errorResponse("Failed to save document", 500);
  }

  return successResponse("Document saved successfully", 200, result);
};

export default saveDocument;
