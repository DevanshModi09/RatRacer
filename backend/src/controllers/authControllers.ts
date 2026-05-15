import { Request, Response } from 'express';
import { createTokenUser } from '../utils/createTokenUser.js';
import { AuthServices } from '../services/authServices.js';
import { attachCookiesToResponse } from '../utils/jwtUtils.js';
class AuthControllers {
  //RegisterController
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
    //Creating Payload object of user;
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, tokenUser });
    res.status(200).json({ user: tokenUser });
  };

  //LoginController

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
    //! Creating Payload object of user;

    const tokenUser = createTokenUser(user);
    //! Attaching the cookie here (not sending the response)

    attachCookiesToResponse({ res, tokenUser });
    //Sending the response here
    res.status(200).json({ user: tokenUser, message: 'User Logged In' });
  };
  static logoutController = async (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({ msg: 'user logged out' });
  };
}

export { AuthControllers };
