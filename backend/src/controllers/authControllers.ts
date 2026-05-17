import { Request, Response } from 'express';
import { createTokenUser } from '../utils/createTokenUser.js';
import { AuthServices } from '../services/authServices.js';
import { attachCookiesToResponse } from '../utils/jwtUtils.js';
import { CustomError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
class AuthControllers {
  //RegisterController
  static registerController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new CustomError.BadRequestError(
        'Please all fields : email , password and username',
      );
    }
    const isUserAlready = await AuthServices.findUserByEmail(email);
    if (isUserAlready) {
      throw new CustomError.BadRequestError('Email already exists');
    }
    const isUsernameAlready = await AuthServices.findUserByUsername(username);
    if (isUsernameAlready) {
      throw new CustomError.BadRequestError('Please choose a unique username');
    }
    const user = await AuthServices.registerUser(username, email, password);
    //Creating Payload object of user;
    const tokenUser = createTokenUser(user);
    const { xp, level, coins, bestWpm, avgWpm } = user;
    attachCookiesToResponse({ res, tokenUser });

    res.status(200).json({
      user: { ...tokenUser, xp, level, coins, bestWpm, avgWpm },
      message: 'Account Created',
    });
  };

  //LoginController

  static loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError.BadRequestError('Please provide all fields');
    }
    const user = await AuthServices.findUserByEmail(email);
    if (!user) {
      throw new CustomError.UnauthenticatedError(
        'User does not exist , please create an account',
      );
    }
    const isPasswordCorrect = await AuthServices.comparePasswords(
      user,
      password,
    );
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials ');
    }
    //! Creating Payload object of user;

    const tokenUser = createTokenUser(user);
    //! Attaching the cookie here (not sending the response)

    attachCookiesToResponse({ res, tokenUser });
    const { xp, level, coins, bestWpm, avgWpm } = user;
    //Sending the response here
    res.status(StatusCodes.OK).json({
      user: { ...tokenUser, xp, level, coins, bestWpm, avgWpm },
      message: 'User Logged In',
    });
  };
  static logoutController = async (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out' });
  };
  static checkAuth = async (req, res) => {
    const user = await AuthServices.findUserById(req.user.userId);
    const { xp, level, coins, bestWpm, avgWpm } = user;
    res.status(StatusCodes.OK).json({
      user: { ...req.user, xp, level, coins, bestWpm, avgWpm },
      message: 'User Logged In',
    });
  };
}

export { AuthControllers };
