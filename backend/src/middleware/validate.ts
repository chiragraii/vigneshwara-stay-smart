import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        error: result.error.errors.map((e) => e.message).join(', '),
        code: 'VALIDATION_ERROR',
      });
      return;
    }
    (req as Request & { validatedQuery: unknown }).validatedQuery = result.data;
    next();
  };
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: result.error.errors.map((e) => e.message).join(', '),
        code: 'VALIDATION_ERROR',
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        error: result.error.errors.map((e) => e.message).join(', '),
        code: 'VALIDATION_ERROR',
      });
      return;
    }
    req.params = result.data as typeof req.params;
    next();
  };
}
