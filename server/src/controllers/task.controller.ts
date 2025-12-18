import { Request, Response } from 'express';
import { TaskService, createTaskSchema } from '../services/task.service';


export const TaskController = {
    getDashboard: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const data = await TaskService.getDashboardTasks(userId);
            res.json(data);
        } catch (err: any) {
            res.status(500).json({ error: "Could not fetch dashboard" });
        }
    },


    create: async (req: Request, res: Response) => {
        try {
            const data = createTaskSchema.parse(req.body);
            const userId = (req as any).user.userId; // Will come from our verifyToken middleware
            const task = await TaskService.createTask(userId, data);
            res.status(201).json(task);
        } catch (err: any) {
            res.status(400).json({ error: err.message || "Validation failed" }); // [cite: 38]
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const taskID = req.params.id as string
            const task = await TaskService.updateTask(taskID, req.body);
            // NOTE: This is where we will later trigger Socket.io emit! [cite: 25]
            res.json(task);
        } catch (err: any) {
            res.status(400).json({ error: "Update failed" });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const taskID = req.params.id as string
            await TaskService.deleteTask(taskID);
            res.status(204).send();
        } catch (err: any) {
            res.status(404).json({ error: "Task not found" }); // [cite: 38]
        }
    }
};