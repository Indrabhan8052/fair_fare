import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { updateMe } from '../controllers/user.controller.js';

const router = Router();

router.patch('/me', requireAuth, updateMe);

export default router;
