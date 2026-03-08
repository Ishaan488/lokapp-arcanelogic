import { Request, Response, NextFunction } from 'express';

type Role = 'CITIZEN' | 'OFFICIAL' | 'ADMIN';

/**
 * Role-Based Access Control middleware factory.
 * Returns a middleware that checks if the authenticated user
 * has one of the allowed roles.
 *
 * Usage:
 *   router.put('/reports/:id/status', authenticate, authorize('OFFICIAL', 'ADMIN'), controller);
 */
export function authorize(...allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required.' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Forbidden. You do not have permission to perform this action.',
                requiredRoles: allowedRoles,
                yourRole: req.user.role,
            });
            return;
        }

        next();
    };
}
