import axios from 'axios';
import toast from 'react-hot-toast';
import { tokenUtils } from '../utils/tokenUtils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ── Primary Axios instance ────────────────────────────────────
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    withCredentials: true,          // sends httpOnly refresh-token cookie
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request interceptor — attach access token ─────────────────
axiosInstance.interceptors.request.use(
    config => {
        const token = tokenUtils.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Unique request ID for tracing
        config.headers['X-Request-ID'] =
            Math.random().toString(36).substring(2, 11);
        return config;
    },
    error => Promise.reject(error)
);

// ── Response interceptor — handle 401 silently ────────────────
let isRefreshing = false;
let failedQueue = [];          // queue of failed requests while refreshing

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve(token)
    );
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    response => response,

    async error => {
        const originalRequest = error.config;

        // 401 — attempt token refresh (only once per request)
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh') &&
            !originalRequest.url.includes('/auth/login')
        ) {
            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh token is in the httpOnly cookie — no body needed
                const { data } = await axiosInstance.post('/api/v1/auth/refresh');
                const newToken = data.data.accessToken;

                tokenUtils.setToken(newToken);
                axiosInstance.defaults.headers.common.Authorization =
                    `Bearer ${newToken}`;

                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenUtils.clearToken();
                // Redirect to login — import dynamically to avoid circular deps
                window.location.href = '/login?session=expired';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 403 — forbidden
        if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action');
        }

        // 500 — server error
        if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;