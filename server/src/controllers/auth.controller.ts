import { Request, Response } from 'express';
import { AuthService, registerSchema, loginSchema } from '../services/auth.service';

export const AuthController = {
    register: async (req: Request, res: Response) => {
        try {
            const data = registerSchema.parse(req.body); // DTO validation [cite: 37]
            const user = await AuthService.register(data);
            res.status(201).json(user);
        } catch (err: any) {
            res.status(400).json({ error: err.message }); // [cite: 38]
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const data = loginSchema.parse(req.body);
            const { user, token } = await AuthService.login(data);

            res.cookie('token', token, {
                httpOnly: true, // 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).json(user);
        } catch (err: any) {
            res.status(401).json({ error: 'Unauthorized' }); // [cite: 38]
        }
    }
};