// API Base URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
  GET_ME: "/auth/me",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "user_data", // Only store user data, not tokens
};

// Routes
export const ROUTES = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};
