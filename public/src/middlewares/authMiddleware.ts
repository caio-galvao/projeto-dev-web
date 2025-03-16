import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }
    
    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded; // Adiciona o usuário decodificado ao objeto `req`
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export const authorize = (
    allowedRoles: string[], 
    condition?: (req: Request, user: any) => Promise<boolean> | boolean) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = (req as any).user;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            return;
        }
        if (condition) {
            try {
                const allowed = await Promise.resolve(condition(req, user));
                if (!allowed) {
                    res.status(403).json({ message: 'Access denied. Attribute check failed.' });
                    return;
                }
            } catch (error) {
                console.error('ABAC check error:', error);
                res.status(500).json({ message: 'Internal Server Error during attribute check.' });
                return;
            }
        }
        next();
    };
};