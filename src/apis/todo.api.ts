import axios from "axios";

const todoAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/todo`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest'
    }
});

export default todoAPI;