import axios from 'axios';

const accountApi = axios.create({
    baseURL: 'http://localhost:3000/account',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest'
    }
});

export default accountApi;