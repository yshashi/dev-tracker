const apiUrl = import.meta.env.VITE_API_URL;

export const APP_NAME = 'DevTracker';
export const API_URL = apiUrl;
export const JWT_TOKEN = localStorage.getItem('authToken');