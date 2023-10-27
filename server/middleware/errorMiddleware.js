function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error for debugging
  
    if (res.headersSent) {
      return next(err);
    }
  
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      error: errorMessage,
    });
  }
  
  module.exports = errorHandler;