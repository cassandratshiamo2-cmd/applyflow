import { Router } from 'express';
import { applicationController } from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', applicationController.getAll);
router.get('/:id', applicationController.getOne);
router.post('/', applicationController.create);
router.put('/:id', applicationController.update);
router.delete('/:id', applicationController.delete);
router.patch('/:id/status', applicationController.updateStatus);

export default router;
