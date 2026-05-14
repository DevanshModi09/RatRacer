import { Request, Response } from 'express';
import { AuthServices } from '../services/authServices.js';
class AuthControllers {
  static registerController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const isUserAlready = await AuthServices.findUserByEmail(email);
    if (isUserAlready) {
      return res.json(
        'User already exists , Please try to log in with existing email and password',
      );
    }
    const user = await AuthServices.registerUser(username, email, password);
    console.log(user);
    res.json({ user });
  };
}

export { AuthControllers };
