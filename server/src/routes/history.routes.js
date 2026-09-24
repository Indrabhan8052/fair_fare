import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { listHistory, addHistory, deleteHistory } from '../controllers/history.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', listHistory);
router.post('/', addHistory);
router.delete('/:id', deleteHistory);

export default router;
