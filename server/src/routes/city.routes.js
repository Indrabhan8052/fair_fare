import { Router } from 'express';
import { listCities, getCity } from '../controllers/city.controller.js';

const router = Router();

router.get('/', listCities);
router.get('/:cityId', getCity);

export default router;
