import { Error } from "mongoose";

const readDocument = async (model, params) => {
  let result;
  try {
    // Find documents with provided params
    result = await model.find(params);

    if (result.length == 0) {
      throw new Error("No documents found matching given params");
    }

    // Return success object
    return {
      success: true,
      message: `Successfully returned documents matching given params`,
      data: result,
      error: null,
    };
  } catch (error) {
    // Handle error

    return {
      success: false,
      message: error.message || `Failed to find documents`,
      data: result,
      error: error,
    };
  }
};

export default readDocument;
