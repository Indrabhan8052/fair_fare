import api from './axios.js';

export const searchPlaces = (q) => api.get('/geocode', { params: { q } }).then((r) => r.data.results);
