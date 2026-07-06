import axiosInstance from './axiosInstance';

const BASE = '/api/v1/auth';

export const authApi = {

    // POST /api/v1/auth/register
    register: (data) =>
        axiosInstance.post(`${BASE}/register`, data),

    // POST /api/v1/auth/login
    login: (data) =>
        axiosInstance.post(`${BASE}/login`, data),

    // POST /api/v1/auth/logout
    logout: () =>
        axiosInstance.post(`${BASE}/logout`),

    // POST /api/v1/auth/refresh  (cookie-based — no body)
    refresh: () =>
        axiosInstance.post(`${BASE}/refresh`),

    // POST /api/v1/auth/forgot-password
    forgotPassword: (email) =>
        axiosInstance.post(`${BASE}/forgot-password`, { email }),

    // POST /api/v1/auth/reset-password
    resetPassword: (data) =>
        axiosInstance.post(`${BASE}/reset-password`, data),

    // POST /api/v1/auth/verify-email
    verifyEmail: (data) =>
        axiosInstance.post(`${BASE}/verify-email`, data),

    // POST /api/v1/auth/resend-verification
    resendVerification: (email) =>
        axiosInstance.post(`${BASE}/resend-verification`, { email }),

    // GET /api/v1/auth/me
    getMe: () =>
        axiosInstance.get(`${BASE}/me`),

    // PUT /api/v1/auth/me
    updateMe: (data) =>
        axiosInstance.put(`${BASE}/me`, data),

    // POST /api/v1/auth/change-password
    changePassword: (data) =>
        axiosInstance.post(`${BASE}/change-password`, data),

    // GET /api/v1/sessions
    getSessions: () =>
        axiosInstance.get('/api/v1/sessions'),

    // DELETE /api/v1/sessions/:id
    revokeSession: (id) =>
        axiosInstance.delete(`/api/v1/sessions/${id}`),

    // DELETE /api/v1/sessions  (all others)
    revokeAllOtherSessions: () =>
        axiosInstance.delete('/api/v1/sessions'),
};