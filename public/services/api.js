const BASE_URL = 'http://localhost:3001';

export const api = {
    async getUsers() {
        const response = await fetch(`${BASE_URL}/users`);
        return response.json();
    },

    async getUserByEmail(email) {
        const response = await fetch(`${BASE_URL}/users?email=${email}`);
        const users = await response.json();
        return users[0] || null;
    },

    async createUser(userData) {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...userData,
                role: 'user',
                avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                jobTitle: 'User',
                createdAt: new Date().toISOString()
            })
        });
        return response.json();
    },

    async updateUser(id, userData) {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    async getTasks() {
        const response = await fetch(`${BASE_URL}/tasks`);
        return response.json();
    },

    async getTasksByUser(userId) {
        const response = await fetch(`${BASE_URL}/tasks?userId=${userId}`);
        return response.json();
    },

    async getTaskById(id) {
        const response = await fetch(`${BASE_URL}/tasks/${id}`);
        return response.json();
    },

    async createTask(taskData) {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...taskData,
                createdAt: new Date().toISOString()
            })
        });
        return response.json();
    },

    async updateTask(id, taskData) {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        return response.json();
    },

    async deleteTask(id) {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};
