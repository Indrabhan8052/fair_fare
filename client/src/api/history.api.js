import api from './axios.js';

export const listHistory = () => api.get('/history').then((r) => r.data.items);
export const addHistory = (payload) => api.post('/history', payload).then((r) => r.data.item);
export const deleteHistory = (id) => api.delete(`/history/${id}`);
