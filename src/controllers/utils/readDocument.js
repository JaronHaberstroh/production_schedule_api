const readDocument = async (model, params) => {
  try {
    // Find documents with provided params
    const result = await model.find(params);

    // Return success object
    return {
      success: true,
      message: `Successfully returned documents`,
      data: result,
      error: null,
    };
  } catch (error) {
    // Handle error

    return {
      success: false,
      message: error.message || `Failed to find documents`,
      data: null,
      error: error,
    };
  }
};

export default readDocument;
