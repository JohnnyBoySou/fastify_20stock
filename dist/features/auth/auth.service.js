import { fetch } from "@/hooks/api";
const URI = "/auth";
export const AuthService = {
    // === AUTH ENDPOINTS ===
    register: (data) => fetch(`${URI}/register`, { method: "POST", data }),
    signup: (data) => fetch(`${URI}/signup`, { method: "POST", data }),
    login: (email, password) => fetch(`${URI}/login`, { method: "POST", data: { email, password } }),
    signin: (email, password) => fetch(`${URI}/signin`, { method: "POST", data: { email, password } }),
    forgotPassword: (email) => fetch(`${URI}/forgot-password`, { method: "POST", data: { email } }),
    verifyResetCode: (email, code) => fetch(`${URI}/verify-reset-code`, { method: "POST", data: { email, code } }),
    resetPassword: (token, password) => fetch(`${URI}/reset-password`, { method: "POST", data: { token, password } }),
    verifyEmail: (token) => fetch(`${URI}/verify-email`, { method: "POST", data: { token } }),
    verifyEmailCode: (email, code) => fetch(`${URI}/verify-email-code`, { method: "POST", data: { email, code } }),
    resendVerification: (email) => fetch(`${URI}/resend-verification`, { method: "POST", data: { email } }),
    refreshToken: () => fetch(`${URI}/refresh-token`, { method: "POST" }),
    logout: () => fetch(`${URI}/logout`, { method: "POST" }),
    // === USER PROFILE ===
    getProfile: () => fetch(`${URI}/profile`, { method: "GET" }),
    updateProfile: (data) => fetch(`${URI}/profile`, { method: "PUT", data }),
    getProfilePermissions: (params) => fetch(`${URI}/profile/permissions`, { method: "GET", params }),
    // === ADMIN ENDPOINTS ===
    getActiveUsers: () => fetch(`${URI}/users/active`, { method: "GET" }),
    getVerifiedUsers: () => fetch(`${URI}/users/verified`, { method: "GET" }),
    getUnverifiedUsers: () => fetch(`${URI}/users/unverified`, { method: "GET" }),
    getUserStats: () => fetch(`${URI}/stats`, { method: "GET" }),
    searchUsers: (q, limit) => fetch(`${URI}/search`, { method: "GET", params: { q, limit } }),
    getPendingVerification: () => fetch(`${URI}/users/pending-verification`, { method: "GET" }),
    getPendingReset: () => fetch(`${URI}/users/pending-reset`, { method: "GET" }),
    // === LEGACY METHODS (mantidos para compatibilidade) ===
    list: () => fetch(URI, { method: "GET" }),
    update: (params) => fetch(URI, { method: "PUT", data: params }),
    exclude: (password) => fetch(URI, { method: "DELETE", data: { password } }),
};
