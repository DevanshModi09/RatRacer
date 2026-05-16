import { Request, Response, NextFunction } from 'express';
import { CustomError } from './../errors/index.js';
import { verifyToken } from './../utils/jwtUtils.js';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
  try {
    const { username, userId, role } = verifyToken(token);
    req.user = { username, userId, role };
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};
