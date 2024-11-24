"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.send(401, { message: 'Authorization header is missing' });
            return next(false);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.send(401, { message: 'Token is missing' });
            return next(false);
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch (error) {
        res.send(403, { message: 'Invalid or expired token' });
        return next(false);
    }
};
exports.authenticate = authenticate;
