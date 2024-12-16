import { Request, Response, Next } from 'restify';
import { decodeToken } from '../utils/JWTUtils';

//validating is the user holds a jwt token that is valid
export const authenticate = (req: Request, res: Response, next: Next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.header('Access-Control-Allow-Origin', '*');
      res.send(401, { message: 'Authorization header is missing' });
      return next(false);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.header('Access-Control-Allow-Origin', '*');
      res.send(401, { message: 'Token is missing' });
      return next(false);
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      res.header('Access-Control-Allow-Origin', '*');
      res.send(403, { message: 'Invalid or expired token' });
      return next(false);
    }

    // Proceed with the request
    return next();
  } catch (error) {
    res.header('Access-Control-Allow-Origin', '*');
    res.send(403, { message: 'Invalid or expired token' });
    return next(false);
  }
};
