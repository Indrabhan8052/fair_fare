import { Router } from 'express';
import { computeRoutes } from '../controllers/route.controller.js';

const router = Router();

router.post('/', computeRoutes);

export default router;
