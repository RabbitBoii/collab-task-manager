import prisma from '../lib/prisma';
import { z } from 'zod';

// DTOs for Validation [cite: 37]
export const createTaskSchema = z.object({
    title: z.string().max(100), // [cite: 16]
    description: z.string().optional(), // [cite: 17]
    dueDate: z.string().transform((str) => new Date(str)), // [cite: 18]
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']), // [cite: 19]
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']), // [cite: 20]
    assignedToId: z.string().uuid().optional(), // [cite: 22]
});

export const TaskService = {
    async createTask(userId: string, data: z.infer<typeof createTaskSchema>) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description ?? null, // Force undefined to null for Prisma [cite: 17]
                dueDate: data.dueDate,
                priority: data.priority,
                status: data.status,
                creatorId: userId, // [cite: 21]
                assignedToId: data.assignedToId ?? null, // Force undefined to null [cite: 22]
            },
            include: { assignedTo: true, creator: true }
        });
    },

    async updateTask(taskId: string, data: Partial<z.infer<typeof createTaskSchema>>) {
        return prisma.task.update({
            where: { id: taskId },
            data: {
                title: data.title,
                description: data.description === undefined ? undefined : (data.description ?? null),
                dueDate: data.dueDate,
                priority: data.priority,
                status: data.status,
                assignedToId: data.assignedToId === undefined ? undefined : (data.assignedToId ?? null),  // Prisma will handle this UUID string
            } as any,
            include: { assignedTo: true, creator: true }
        });
    },

    async getDashboardTasks(userId: string) {
        const now = new Date();

        const assignedToMe = await prisma.task.findMany({
            where: { assignedToId: userId },
            include: { creator: true }
        });

        const createdByMe = await prisma.task.findMany({
            where: { creatorId: userId },
            include: { assignedTo: true }
        });

        const overdue = await prisma.task.findMany({
            where: {
                assignedToId: userId,
                dueDate: { lt: now },
                status: { not: 'COMPLETED' }
            },
            orderBy: { dueDate: 'asc' }
        })

        return { assignedToMe, createdByMe, overdue }
    },

    async getAllTasks(filters: any) {
        return prisma.task.findMany({
            where: filters,
            orderBy: { dueDate: 'asc' }, // [cite: 32]
            include: { assignedTo: true, creator: true }
        });
    },

    async deleteTask(taskId: string) {
        return prisma.task.delete({ where: { id: taskId } });
    }
};