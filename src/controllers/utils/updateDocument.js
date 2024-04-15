import AppError from "#utils/appError.js";

const updateDocumment = async (model, params) => {
  let result;
  try {
    // Update document
    result = await model.updateOne({ _id: params.query }, params.params);

    // Throw Error when document not found
    if (!result.matchedCount) {
      throw new AppError(`Failed to locate a matching document`, 404);
    }

    // Throw Error when document not modified
    if (!result.modifiedCount) {
      throw new AppError(`Document not modified`, 500);
    }

    // Return success object
    return {
      statusCode: result.statusCode || 200,
      success: true,
      message: `Successfully updated document`,
      data: result,
      error: null,
    };
  } catch (error) {
    // Handle errors

    return {
      statusCode: error.statusCode,
      success: false,
      message: `Failed to update document: ${error.message}`,
      data: null,
      error: error,
    };
  }
};

export default updateDocumment;
