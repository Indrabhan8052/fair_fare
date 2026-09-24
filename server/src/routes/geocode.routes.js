import { Router } from 'express';
import { searchPlaces } from '../services/geocode.service.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q || q.trim().length < 2) return res.json({ results: [] });
    const results = await searchPlaces(q.trim());
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

export default router;
