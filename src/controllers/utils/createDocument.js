const createDocument = async (model, params) => {
  let savedDocument;
  try {
    // Create new document
    const newDocument = new model(params);

    // Save new document
    savedDocument = await newDocument.save();

    // Return success object
    return {
      success: true,
      message: `Successfully saved model: ${model.name}`,
      data: savedDocument,
      error: null,
    };
  } catch (error) {
    // Handle Error

    // Return fail object
    return {
      success: false,
      message: error.message || `Failed to save document`,
      data: savedDocument,
      error: error,
    };
  }
};

export default createDocument;
