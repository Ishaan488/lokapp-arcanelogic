import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware.
 * Catches any unhandled errors and returns a consistent JSON response.
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    res.status(500).json({
        error: 'Internal server error.',
        ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    });
}
