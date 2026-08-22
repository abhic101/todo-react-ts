import axios from 'axios';

const authAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default authAPI;