import { Error } from "mongoose";

const deleteDocument = async (model, params) => {
  let result;
  try {
    // Delete document matching params
    result = await model.deleteOne(params);

    // Throw error if document not deleted
    if (!result.deletedCount) {
      throw new Error(`Failed to delete document`);
    }

    // Return success object
    return {
      success: true,
      message: result.message || `Successfully deleted document`,
      data: result,
      error: null,
    };
  } catch (error) {
    // Handle Error

    return {
      success: false,
      message: error.message || `Failed to delete document`,
      data: result,
      error: error,
    };
  }
};

export default deleteDocument;
