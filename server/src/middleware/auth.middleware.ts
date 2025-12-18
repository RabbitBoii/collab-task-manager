import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Read from HttpOnly cookie 

    if (!token) return res.status(401).json({ error: "Access denied" }); // [cite: 38]

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};