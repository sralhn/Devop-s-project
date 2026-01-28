import axios from 'axios';

// In Docker, localhost refers to the container itself. 
// We need to point to the backend container or localhost if mapped.
// For browser running on host, localhost:3000 works if backend maps port 3000.
const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const registerForEvent = (id) => api.post(`/events/${id}/register`);
export const unregisterFromEvent = (id) => api.post(`/events/${id}/unregister`);
