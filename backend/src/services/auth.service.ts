import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export class AuthService {
  async registerUser(data: { name: string; email: string; password: string }): Promise<User> {
    const normalizedEmail = data.email.trim().toLowerCase();
    console.log(`Attempting to register user with email: ${normalizedEmail}`);

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      console.log(`User already exists: ${normalizedEmail}`);
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        passwordHash,
      },
    });
  }

  async loginUser(email: string, pass: string): Promise<{ user: User; token: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Attempting login for email: ${normalizedEmail}`);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (!user) {
      throw new Error('Invalid email or password');
    }


    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return { user, token };
  }

  async generateToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  }
}

export const authService = new AuthService();
