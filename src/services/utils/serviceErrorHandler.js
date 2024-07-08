import AppError from "#utils/AppError";

const serviceErrorHandler = (Model, error) => {
  if (error instanceof AppError) {
    const err = new AppError(
      `Service Error: ${Model.modelName}, ${error.message}`,
      error.statusCode || 500,
    );
    return { error: err };
  }

  const err = new AppError(
    `Unhandled Exception: ${Model.modelName}, ${error.message}`,
    error.statusCode || 500,
  );
  return { error: err };
};

export default serviceErrorHandler;
