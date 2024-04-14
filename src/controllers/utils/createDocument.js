const createDocument = async (model, params) => {
  try {
    // Create new document
    const newDocument = new model(params);

    // Save new document
    const savedDocument = await newDocument.save();

    // Return success object
    return {
      success: true,
      message: `Successfully saved new document; {model: ${model.modelName}}`,
      data: savedDocument,
      error: null,
    };
  } catch (error) {
    // Handle Error

    // Return fail object
    return {
      success: false,
      message: `Failed to save new document: ${error.message}`,
      data: null,
      error: error,
    };
  }
};

export default createDocument;
