import { errorResponse, successResponse } from "#responses/response.js";

const createDocument = async (model, params) => {
  const newDocument = new model(params);

  let savedDocument;
  try {
    savedDocument = await newDocument.save();
  } catch (error) {
    return errorResponse(
      `Error while saving new document: ${error.message}`,
      error.statusCode || 500
    );
  }

  return successResponse(`Successfully saved new document`, 201, savedDocument);
};

export default createDocument;
