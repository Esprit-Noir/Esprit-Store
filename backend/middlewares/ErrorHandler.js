// Not Found

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  req.status(404);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};
