import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// All task routes require a valid session/token [cite: 10, 12]
router.use(verifyToken);

router.get('/dashboard', TaskController.getDashboard)
router.post('/', TaskController.create);          // POST /api/tasks
router.patch('/:id', TaskController.update);      // PATCH /api/tasks/:id
router.delete('/:id', TaskController.delete);    // DELETE /api/tasks/:id

export default router;