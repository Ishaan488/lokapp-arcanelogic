import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

// Extend Express Request to include user info
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Authentication middleware.
 * Extracts and verifies the JWT from the Authorization header.
 * Populates req.user with the decoded payload.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication required. Provide a Bearer token.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
        return;
    }
}
