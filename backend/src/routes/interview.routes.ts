import { Router } from 'express';
import { interviewController } from '../controllers/interview.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', interviewController.getAll);
router.get('/:id', interviewController.getOne);
router.post('/', interviewController.create);
router.put('/:id', interviewController.update);
router.delete('/:id', interviewController.delete);

export default router;
