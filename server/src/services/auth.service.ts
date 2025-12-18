import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { z } from 'zod'; // For DTO validation [cite: 37]

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const AuthService = {
    async register(data: z.infer<typeof registerSchema>) {
        const hashedPassword = await bcrypt.hash(data.password, 10); // 
        return prisma.user.create({
            data: { ...data, password: hashedPassword },
            select: { id: true, name: true, email: true }
        });
    },

    async login(data: z.infer<typeof loginSchema>) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }
};