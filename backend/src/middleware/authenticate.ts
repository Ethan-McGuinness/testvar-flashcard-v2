import { Request, Response, Next } from 'restify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = (req: Request, res: Response, next: Next) => {
    try{
        const authHeader= req.headers.authorization;

        if (!authHeader) {
            res.send(401, {message: 'Authorization header is missing'});
            return next(false);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.send(401, {message: 'Token is missing'});
            return next(false);
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded as { userId: number; username: string; admin: boolean };
        return next();
      } catch (error) {
        res.send(403, { message: 'Invalid or expired token' });
        return next(false);
      }
    };