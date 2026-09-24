import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import cityRoutes from './routes/city.routes.js';
import routeRoutes from './routes/route.routes.js';
import historyRoutes from './routes/history.routes.js';
import userRoutes from './routes/user.routes.js';
import geocodeRoutes from './routes/geocode.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/geocode', geocodeRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);

export default app;
