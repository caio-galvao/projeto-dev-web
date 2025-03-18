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