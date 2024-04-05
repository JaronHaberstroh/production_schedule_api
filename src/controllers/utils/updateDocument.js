import { Error } from "mongoose";

const updateDocumment = async (model, params) => {
  let result;
  try {
    // Update document
    result = await model.updateOne({ _id: params[0] }, params[1]);

    // Throw Error when document not found
    if (!result.matchedCount) {
      throw new Error(`Failed to locate a matching document`);
    }

    // Throw Error when document not modified
    if (!result.modifiedCount) {
      throw new Error("Failed to update document");
    }

    // Return success object
    return {
      success: true,
      message: `Successfully updated document`,
      data: result,
      error: null,
    };
  } catch (error) {
    // Handle errors

    return {
      success: false,
      message: error.message || `Failed to update document`,
      data: result,
      error: error,
    };
  }
};

export default updateDocumment;
