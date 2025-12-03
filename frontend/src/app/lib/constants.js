// API Base URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_RESET_OTP: "/auth/verify-reset-otp",
  RESET_PASSWORD: "/auth/reset-password",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
  GET_ME: "/auth/me",

  // Google OAuth endpoints
  GOOGLE_AUTH: "/auth/google",
  GOOGLE_CALLBACK: "/auth/google/callback",
  GOOGLE_REFRESH_TOKEN: "/auth/google/refresh-token",

  // Booking endpoints (User)
  CREATE_BOOKING: "/api/bookings",
  MY_BOOKINGS: "/api/bookings/my-bookings",
  CANCEL_BOOKING: (id) => `/api/bookings/${id}/cancel`,
  GET_BOOKING: (id) => `/api/bookings/${id}`,
  CALCULATE_FARE: "/api/bookings/calculate-fare",

  // Vehicle endpoints (Public)
  VEHICLE_TYPES: "/api/vehicles/types",

  // Settings endpoints (Public)
  GET_SETTINGS: "/api/settings",
  GET_RUSH_HOURS: "/api/settings/rush-hours",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "user_data", // Only store user data, not tokens
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  VERIFY_OTP: "/auth/verify-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_RESET_OTP: "/auth/verify-reset-otp",
  RESET_PASSWORD: "/auth/reset-password",
  OAUTH_SUCCESS: "/auth/oauth-success",
  DASHBOARD: "/dashboard",
  BOOKING: "/booking",
  HISTORY: "/history",
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Vehicle Types
export const VEHICLE_TYPES = {
  SEDAN: "sedan",
  SUV: "suv",
  LUXURY: "luxury",
  VAN: "van",
  MINI: "mini",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};
