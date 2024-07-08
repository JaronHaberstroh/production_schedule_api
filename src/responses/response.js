import AppError from "#utils/AppError.js";

export const successResponse = (message, statusCode, data = null) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    error: null,
  };
};

export const errorResponse = (message, statusCode) => {
  return {
    success: false,
    statusCode,
    message,
    data: null,
    error: new AppError(message, statusCode),
  };
};
