import { PrismaClient } from '@prisma/client/extension';
import bcrypt from 'bcryptjs';
import type { UserModel } from '../generated/prisma/models/User.js';
const prisma = new PrismaClient();

class AuthService {
  static registerUser = async (
    username: string,
    email: string,
    password: string,
  ): Promise<UserModel> => {
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    return user;

    
  };
}
