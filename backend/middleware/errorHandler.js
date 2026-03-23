const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose CastError (e.g., Invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  // Validation Error (Mongoose)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message)[0];
    return res.status(422).json({ message });
  }

  // Default
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(err.status || statusCode).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
