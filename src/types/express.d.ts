import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        schoolId: string;
        entityId: string;
        roles: string[];
      };
    }
  }
} 