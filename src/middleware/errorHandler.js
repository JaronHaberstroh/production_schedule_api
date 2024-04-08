const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "An unknow error occured!",
    });
  }

  res.status(error.statusCode || 500).json({
    status: error.statusCode || 500,
    message: error.message || "An unknown error occured!",
    error: error,
    stack: error.stack,
  });
};

export default errorHandler;
