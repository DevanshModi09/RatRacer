import { JwtPayload } from '../utils/jwtUtils.ts';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export {};
