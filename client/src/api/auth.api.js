import api from './axios.js';

export const signup = (data) => api.post('/auth/signup', data).then((r) => r.data);
export const login = (data) => api.post('/auth/login', data).then((r) => r.data);
export const fetchMe = () => api.get('/auth/me').then((r) => r.data);
export const updateMe = (data) => api.patch('/users/me', data).then((r) => r.data);
