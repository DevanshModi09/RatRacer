import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomAPIError } from '../errors/custom-api.js';
import { StatusCodes } from 'http-status-codes';

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  let customError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong try again later',
  };
  if (err instanceof CustomAPIError) {
    customError.statusCode = err.statusCode;
    customError.msg = err.message;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};
