import { Request, Response } from 'express';
import { AuthServices } from '../services/authServices.js';
class AuthControllers {
  static registerController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({ msg: 'please provide all fields biro' });
    }
    const isUserAlready = await AuthServices.findUserByEmail(email);
    if (isUserAlready) {
      return res.json(
        'User already exists , Please try to log in with existing email and password',
      );
    }
    const user = await AuthServices.registerUser(username, email, password);
    console.log(user);
    return res.json({ user });
  };
  static loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ msg: 'please provide all fields biro' });
    }
    const user = await AuthServices.findUserByEmail(email);
    if (!user) {
      return res.json({
        msg: 'user does not exist please create account first ',
      });
    }
    const isPasswordCorrect = await AuthServices.comparePasswords(
      user,
      password,
    );
    if (!isPasswordCorrect) {
      return res.json({ msg: 'password wrong biro' });
    }
    if (isPasswordCorrect) {
      return res.json({ msg: 'you are logged in' });
    }
  };
}

export { AuthControllers };
