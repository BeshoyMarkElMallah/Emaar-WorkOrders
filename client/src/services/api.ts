import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Base URL for the API
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor for global error handling (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if error response exists
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
