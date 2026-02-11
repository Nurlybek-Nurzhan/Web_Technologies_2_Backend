// Error logging and handling middleware
const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('--- Error ---');
  console.error(`${req.method} ${req.originalUrl}`);
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error('--- End Error ---');

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
