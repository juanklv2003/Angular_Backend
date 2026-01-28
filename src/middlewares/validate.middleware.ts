import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

declare module 'express-serve-static-core' {
  interface Request {
    validated?: any;
  }
}

export const validate =
  (schema: ZodSchema, where: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[where]);
      req.validated = {
        ...req.validated,
        [where]: parsed
      };
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message
          }))
        });
      }
      next(err);
    }
  };
