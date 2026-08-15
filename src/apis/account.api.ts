import axios from 'axios';

const accountApi = axios.create({
    baseURL: 'https://todo-backend.mooo.com/account',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest'
    }
});

export default accountApi;