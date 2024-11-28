import axios from 'axios';
import { getToken } from './auth';

const Axios = axios.create({
    baseURL: 'https://backend-pv08.onrender.com/'
});

Axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default Axios;
