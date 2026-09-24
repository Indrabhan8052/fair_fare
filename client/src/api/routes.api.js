import api from './axios.js';

export const computeRoutes = (payload) => api.post('/routes', payload).then((r) => r.data);
