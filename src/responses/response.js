import AppError from "#utils/appError.js";

const successResponse = (message, statusCode, data = null) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    error: null,
  };
};

const errorResponse = (message, statusCode) => {
  return {
    success: false,
    statusCode,
    message,
    data: null,
    error: new AppError(message, statusCode),
  };
};
export { successResponse, errorResponse };
