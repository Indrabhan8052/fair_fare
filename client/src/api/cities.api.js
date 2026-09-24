import api from './axios.js';

export const listCities = () => api.get('/cities').then((r) => r.data.cities);
export const getCity = (cityId) => api.get(`/cities/${cityId}`).then((r) => r.data.city);
