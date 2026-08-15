import axios from 'axios';

const authAPI = axios.create({
    baseURL: 'https://todo-backend.mooo.com/auth',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default authAPI;