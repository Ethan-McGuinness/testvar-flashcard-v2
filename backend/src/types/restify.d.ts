// restify.d.ts
import { User } from '@prisma/client';

declare module 'restify' {
  interface Request {
    user?: {
      userId: number;  // the ID from the decoded JWT
      admin: boolean;  // the admin status from the decoded JWT
    };
  }
}
