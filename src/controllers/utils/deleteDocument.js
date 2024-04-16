import AppError from "#utils/appError.js";

const deleteDocument = async (model, params) => {
  try {
    // Delete document matching params
    const result = await model.deleteOne(params);

    // Throw error if document not deleted
    if (!result.deletedCount) {
      throw new AppError(`Document not deleted`, 500);
    }

    // Return success object
    return {
      statusCode: 200,
      success: true,
      message: `Successfully deleted document`,
      data: result,
      error: null,
    };
  } catch (error) {
    // Handle Error

    return {
      statusCode: error.statusCode || 500,
      success: false,
      message: `Failed to delete document: ${error.message}`,
      data: null,
      error: error,
    };
  }
};

export default deleteDocument;
