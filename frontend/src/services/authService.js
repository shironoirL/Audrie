// src/services/authService.js

import axios from 'axios';

const API_URL = 'backend:8000/api/auth/';

const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'token/login/', {
            username: username,
            password: password
        });
        if (response.data.auth_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    login,
    logout
};

export default authService;
