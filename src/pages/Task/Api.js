import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const createTask = (taskData, token) =>
    axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const getTasks = (token) =>
    axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const completeTask = (taskId, token) =>
    axios.post(`${API_URL}/tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteTask = (taskId, token) =>
    axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
