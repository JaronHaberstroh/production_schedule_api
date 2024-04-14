const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.statusCode || 500).json({
    status: error.statusCode || 500,
    message: error.message || "An unknown error occured!",
    stack: process.env.NODE_ENV === "development" || "test" ? error.stack : {},
  });
};

export default errorHandler;
