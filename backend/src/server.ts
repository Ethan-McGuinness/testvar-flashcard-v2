import restify from 'restify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerAuthRoutes } from './routes/authRoutes';
import corsMiddleware, { CorsMiddleware } from 'restify-cors-middleware2';
import { registerUserRoutes } from './routes/userRoutes';
import { registerSetRoutes } from './routes/setRoutes';
import { registerCollectionRoutes } from './routes/collectionRoutes';
import { registerFlashcardRoutes } from './routes/flashcardRoutes';
import { registerCommentRoutes } from './routes/commentRoutes';


const server = restify.createServer({
  name: 'API',
  version: '1.0.0',
});
const prisma = new PrismaClient();

const cors: corsMiddleware.CorsMiddleware = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['Authorization', 'Content-Type'],
  
});

server.pre(cors.preflight);
server.use(cors.actual);

// Middleware to parse request bodies
server.use(restify.plugins.bodyParser());

// Register the authRoutes
registerAuthRoutes(server);

// Register user routes 
registerUserRoutes(server);

// Register Set Routes
registerSetRoutes(server);

// Register Collection routes
registerCollectionRoutes(server);

// Register Flashcard routes
registerFlashcardRoutes(server);

//Register the comment routes
registerCommentRoutes(server);



server.get('/', (req, res, next) => {
  res.send({ message: 'API is running' });
  return next();
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running at http://localhost:5000');
});
