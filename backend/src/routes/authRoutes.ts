import { Request, Response, Next } from 'restify';
import { loginUser } from '../controllers/authContoller';
import { authenticate } from '../middleware/authenticate';

export function registerAuthRoutes(server: any) {
  // Login route
  server.post('/auth/login', (req: Request, res: Response, next: Next) => {
    loginUser(req, res, next);
  });

  // Example protected route
  server.get('/protected', authenticate, (req: any, res: Response, next: Next) => {
    if (req.user) {
      res.send(200, { message: `Welcome ${req.user.username}, Admin: ${req.user.admin}` });
    } else {
      res.send(401, { message: 'Unauthorized access' });
    }
    return next();
  });
}
