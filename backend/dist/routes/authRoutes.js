"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthRoutes = registerAuthRoutes;
const authContoller_1 = require("../controllers/authContoller");
const authenticate_1 = require("../middleware/authenticate");
function registerAuthRoutes(server) {
    // Login route
    server.post('/auth/login', (req, res, next) => {
        (0, authContoller_1.loginUser)(req, res, next);
    });
    // Example protected route
    server.get('/protected', authenticate_1.authenticate, (req, res, next) => {
        if (req.user) {
            res.send(200, { message: `Welcome ${req.user.username}, Admin: ${req.user.admin}` });
        }
        else {
            res.send(401, { message: 'Unauthorized access' });
        }
        return next();
    });
}
