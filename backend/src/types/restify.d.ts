// restify.d.ts
import { User } from '@prisma/client';

declare module 'restify' {
  interface Request {
    user?: {
      userId: number; 
      username: string;  // the ID from the decoded JWT
      admin: boolean;  // the admin status from the decoded JWT
    };
  }
}
