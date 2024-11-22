import { Router } from 'restify-router';
import { loginUser } from '../controllers/authContoller';
import { authenticate } from '../middleware/authenticate';

const authRoutes = new Router();

authRoutes.post('/login', loginUser);

// Example protected route
authRoutes.get('/protected', authenticate, (req, res, next) => {
  if (req.user) {
    res.send(200, { message: `Welcome ${req.user.username}, Admin: ${req.user.admin}` });
  } else {
    res.send(401, { message: 'Unauthorized access' });
  }
  return next();
});

export default authRoutes;
