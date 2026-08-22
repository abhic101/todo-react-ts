import axios from 'axios';

const accountApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/account`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest'
    }
});

export default accountApi;