import { Request, Response, Next } from "restify";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

//validates the username, password and jwt token
export const loginUser = async (req: Request, res: Response, next: Next) => {
    try{
        const {username, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {username},
        });

        if (!user) {
            res.send(404,{message: 'User not found'});
            console.log('username not found');
            return next();
        }

        const passwordMatch = await bcrypt.compare(password,user.password);
        if (!passwordMatch) {
            res.send(401, {message: 'invalid Password'});
            console.log('password invalid');
            return next();
        }

        const token = jwt.sign(
            {userId: user.id, username: user.username, admin: user.admin},
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.send(200, {message: 'Login successful', token});
    } catch (error) {
        console.error(error);
        res.send(500, {message: 'an error occured during the login process'});
    }
    return next();
}