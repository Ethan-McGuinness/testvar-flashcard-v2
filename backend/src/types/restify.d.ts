import { Request } from 'restify';

declare module 'restify' {
 export  interface Request {
    user?: { 
      userId: number; 
      username: string; 
      admin: boolean;
    };
  }
}

