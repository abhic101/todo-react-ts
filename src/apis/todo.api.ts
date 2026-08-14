import axios from "axios";

const todoAPI = axios.create({
    baseURL: 'http://localhost:3000/todo',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest'
    }
});

export default todoAPI;