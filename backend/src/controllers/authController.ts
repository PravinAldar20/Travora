import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { dbStore } from '../services/dbStore';
import { AuthRequest } from '../middleware/authMiddleware';

const AUTH_SECRET = process.env.AUTH_SECRET || 'travora-super-secure-jwt-secret-key-change-in-production-2026';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function register(req: Request, res: Response) {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message,
      });
    }

    const { name, email, password, confirmPassword } = req.body;

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match.',
      });
    }

    // Duplicate account detection
    const existing = await dbStore.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.',
      });
    }

    // Password hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await dbStore.createUser({
      name,
      email,
      passwordHash,
      homeCurrency: 'USD',
      language: 'en',
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      AUTH_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        homeCurrency: user.homeCurrency,
        language: user.language,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Registration failed due to a server error. Please try again.',
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message,
      });
    }

    const { email, password } = req.body;
    const user = await dbStore.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      AUTH_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      message: 'Welcome back to Travora!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        homeCurrency: user.homeCurrency,
        language: user.language,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.',
    });
  }
}

export async function logout(req: Request, res: Response) {
  return res.json({
    success: true,
    message: 'Logged out successfully. Redirecting to login.',
  });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const user = await dbStore.findUserByEmail(email);
  if (!user) {
    // Return friendly generic response for security
    return res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.',
    });
  }

  return res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. (Demo reset token generated).`,
    resetToken: `reset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  });
}

export async function getProfile(req: AuthRequest, res: Response) {
  const user = await dbStore.findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User profile not found.' });
  }

  const preferences = await dbStore.getPreferences(user.id);

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      homeCurrency: user.homeCurrency,
      language: user.language,
      preferences,
    },
  });
}

export async function updateProfile(req: AuthRequest, res: Response) {
  const { name, homeCurrency, language, avatarUrl } = req.body;
  const updatedUser = await dbStore.updateUser(req.user!.id, {
    name,
    homeCurrency,
    language,
    avatarUrl,
  });

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: updatedUser,
  });
}

export async function updatePreferences(req: AuthRequest, res: Response) {
  const updatedPref = await dbStore.updatePreferences(req.user!.id, req.body);
  return res.json({
    success: true,
    message: 'Preferences updated successfully.',
    preferences: updatedPref,
  });
}
