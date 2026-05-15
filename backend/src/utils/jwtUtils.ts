import jwt from 'jsonwebtoken';

const createJWT = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME as jwt.SignOptions['expiresIn'],
  });
};

export const attachCookiesToResponse = ({ res, tokenUser }) => {
  const token = createJWT(tokenUser);
  const sixDay = 1000 * 60 * 60 * 24 * 6;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + sixDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
