// src/api.js
import axios from 'axios';

// Define the base URL for the API
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; // Default to local URL

// Create an Axios instance with the base URL
const api = axios.create({
    baseURL,
});

export default api;
