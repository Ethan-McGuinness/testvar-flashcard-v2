import { Request, Response, Next } from 'restify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper function to generate JWT
const generateToken = (user: { id: number, username: string, admin: boolean }) => {
  return jwt.sign({ userId: user.id, admin: user.admin }, 'your_secret_key', { expiresIn: '1h' });
};

// Middleware to protect routes
const authenticateJWT = (req: Request, res: Response, next: Next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Assuming Bearer token

  if (!token) {
    res.send(403, { message: 'No token provided' });
    return next();
  }

  jwt.verify(token, 'your_secret_key', (err: any, decoded: any) => {
    if (err) {
      res.send(403, { message: 'Invalid or expired token' });
      return next();
    }

    // Attach decoded user to the request object
    req.user = { userId: decoded.userId, admin: decoded.admin };
    return next();
  });
};

// Register a new user
export const createUser = async (req: Request, res: Response, next: Next) => {
  try {
    const { username, password, admin } = req.body;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        admin: admin || false,
      },
    });

    res.send(201, newUser);
  } catch (error) {
    res.send(500, { message: 'Error creating user', error });
  }
  return next();
};

// Login user (create JWT)
export const loginUser = async (req: Request, res: Response, next: Next) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    res.send(400, { message: 'User not found' });
    return next();
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.send(400, { message: 'Invalid password' });
    return next();
  }

  // Generate a JWT
  const token = generateToken(user);

  res.send(200, { message: 'Login successful', token });
  return next();
};

// Example of a protected route
export const protectedRoute = (req: Request, res: Response, next: Next) => {
  if (!req.user) {
    res.send(401, { message: 'User not authenticated' });
    return next();
  }

  // Use `userId` which was attached in `authenticateJWT`
  res.send(200, { message: `Hello, user ${req.user.userId}! You are ${req.user.admin ? 'an admin' : 'a regular user'}.` });
  return next();
};
