import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Fix: Changed interface to a type intersection to correctly inherit properties from express.Request.
export type AuthRequest = Request & {
    user?: {
        id: string;
        tenantId: string;
    };
};

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, tenantId: string };
        req.user = { id: decoded.id, tenantId: decoded.tenantId };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default authMiddleware;