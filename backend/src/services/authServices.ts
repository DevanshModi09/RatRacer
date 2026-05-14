import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { User } from '../generated/prisma/client.js';
class AuthServices {
  static registerUser = async (
    username: string,
    email: string,
    password: string,
  ): Promise<User> => {
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
  static findUserByEmail = async (email: string) => {
    console.log(email);
    const user: User = await prisma.user.findUnique({ where: { email } });
    return user;
  };
}

export { AuthServices };
