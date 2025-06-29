import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
}

// 🔹 Global error handler middleware
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: CustomError = { ...err };
  error.message = err.message;

  console.error('❌ Error:', err);

  // 🔸 Mongoose ObjectId cast error
  if (err.name === 'CastError') {
    error = {
      name: 'CastError',
      message: 'Resource not found',
      statusCode: 404
    };
  }

  // 🔸 Duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    error = {
      name: 'DuplicateError',
      message: 'Duplicate field value entered',
      statusCode: 400
    };
  }

  // 🔸 Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((val) => val.message)
      .join(', ');
    error = {
      name: 'ValidationError',
      message,
      statusCode: 400
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 🔹 Catch-all for unknown routes
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not found - ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  next(error);
};
