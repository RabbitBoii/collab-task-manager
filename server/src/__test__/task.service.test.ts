// server/src/__tests__/task.service.test.ts
import { TaskService, createTaskSchema } from '../services/task.service';
import prisma from '../lib/prisma';

// Mock the prisma client
jest.mock('../lib/prisma', () => ({
    task: {
        create: jest.fn(),
    },
}));

describe('TaskService Unit Tests', () => {

    // Test 1: Validation Logic (Zod Schema)
    it('should throw an error if the task title exceeds 100 characters', () => {
        const longTitle = 'a'.repeat(101);
        const invalidData = {
            title: longTitle,
            priority: 'HIGH',
            status: 'TODO',
            dueDate: '2025-12-31'
        };

        const result = createTaskSchema.safeParse(invalidData);
        expect(result.success).toBe(false); //
    });

    // Test 2: Successful Task Creation
    it('should successfully create a task with valid data', async () => {
        const mockTask = {
            id: 'uuid-123',
            title: 'Test Task',
            creatorId: 'user-456',
            priority: 'LOW',
            status: 'TODO'
        };

        (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

        const validData = {
            title: 'Test Task',
            priority: 'LOW' as const,
            status: 'TODO' as const,
            dueDate: '2025-12-31'
        };

        const result = await TaskService.createTask('user-456', validData as any);
        expect(result.title).toBe('Test Task');
        expect(prisma.task.create).toHaveBeenCalled(); //
    });

    // Test 3: Date Transformation Logic
    it('should correctly transform a string date into a Date object', () => {
        const data = {
            title: 'Date Test',
            priority: 'MEDIUM',
            status: 'TODO',
            dueDate: '2025-12-25'
        };

        const parsedData = createTaskSchema.parse(data);
        expect(parsedData.dueDate).toBeInstanceOf(Date);
        expect(parsedData.dueDate.getFullYear()).toBe(2025); //
    });
});