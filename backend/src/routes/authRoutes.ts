import { Request, Response, Next } from 'restify';
import { loginUser } from '../controllers/authContoller';
import { authenticate } from '../middleware/authenticate';
import { decodeToken } from '../utils/JWTUtils';

export function registerAuthRoutes(server: any) {
  // Login route
  server.post('/auth/login', (req: Request, res: Response, next: Next) => {
    loginUser(req, res, next);
  });

  // Protected route
  server.get('/protected', authenticate, (req: any, res: Response, next: Next) => {
    if (req.user) {
      res.send(200, { message: `Welcome ${req.user.username}, Admin: ${req.user.admin}` });
    } else {
      res.send(401, { message: 'Unauthorized access' });
    }
    return next();
  });

  // Decode token route
  server.post('/auth/decode-token', (req: Request, res: Response, next: Next) => {
    const { token } = req.body;

    if (!token) {
      return res.send(400, { message: 'Token is required' });
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return res.send(400, { message: 'Invalid token' });
    }

    res.send(200, decoded);
    return next();
  });
}
