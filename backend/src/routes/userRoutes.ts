import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Server } from 'restify';

const prisma = new PrismaClient();

export const registerUserRoutes = (server: Server) => {
  // Get all users
  server.get('/users', async (req, res, next) => {
    try {
      const users = await prisma.user.findMany();
      res.send(users);
    } catch (error) {
      res.send(500, { message: 'Error retrieving users', error });
    }
    return next();
  });

  // Create a new user
  server.post('/users', async (req, res, next) => {
    try {
      const { username, admin, password } = req.body;

      if (!password) {
        return res.send(400, { message: 'Password is required' });
      }

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
  });

  // Get user by ID
  server.get('/users/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        res.send(404, { message: 'User not found' });
      } else {
        res.send(user);
      }
    } catch (error) {
      res.send(500, { message: 'Error retrieving user', error });
    }
    return next();
  });

  // Update a user by ID
  server.put('/users/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { username, admin, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.send(404, { message: 'User not found' });
      }

      let hashedPassword = undefined;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          username: username || user.username,
          admin: admin !== undefined ? admin : user.admin,
          password: hashedPassword || user.password,
        },
      });

      res.send(updatedUser);
    } catch (error) {
      res.send(500, { message: 'Error updating user', error });
    }
    return next();
  });

  // Delete a user by ID
  server.del('/users/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;

      const deletedUser = await prisma.user.delete({
        where: { id: Number(userId) },
      });

      res.send(deletedUser);
    } catch (error) {
      res.send(500, { message: 'Error deleting user', error });
    }
    return next();
  });
};
