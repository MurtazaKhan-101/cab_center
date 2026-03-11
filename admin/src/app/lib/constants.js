// API Base URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
  GET_ME: "/auth/me",

  // Bookings
  BOOKINGS: "/api/bookings",
  BOOKING_BY_ID: (id) => `/api/bookings/${id}`,
  APPROVE_BOOKING: (id) => `/api/bookings/${id}/approve`,
  REJECT_BOOKING: (id) => `/api/bookings/${id}/reject`,
  COMPLETE_BOOKING: (id) => `/api/bookings/${id}/complete`,
  UPDATE_BOOKING: (id) => `/api/bookings/${id}`,
  DELETE_BOOKING: (id) => `/api/bookings/${id}`,
  DOWNLOAD_RECEIPT: (id) => `/api/bookings/${id}/receipt`,

  // Drivers
  DRIVERS: "/api/drivers",
  DRIVER_BY_ID: (id) => `/api/drivers/${id}`,
  AVAILABLE_DRIVERS: "/api/drivers/available",
  UPDATE_DRIVER: (id) => `/api/drivers/${id}`,
  UPDATE_DRIVER_ATTENDANCE: (id) => `/api/drivers/${id}/attendance`,
  DELETE_DRIVER: (id) => `/api/drivers/${id}`,

  // Vehicles
  VEHICLES: "/api/vehicles",
  VEHICLE_BY_ID: (id) => `/api/vehicles/${id}`,
  AVAILABLE_VEHICLES: "/api/vehicles/available",
  VEHICLE_TYPES: "/api/vehicles/types",
  UPDATE_VEHICLE: (id) => `/api/vehicles/${id}`,
  DELETE_VEHICLE: (id) => `/api/vehicles/${id}`,

  // Settings
  SETTINGS: "/api/settings",
  RUSH_HOURS: "/api/settings/rush-hours",
  UPDATE_BASE_FARE: "/api/settings/base-fare",
  ADD_RUSH_HOUR: "/api/settings/rush-hours",
  UPDATE_RUSH_HOUR: (id) => `/api/settings/rush-hours/${id}`,
  DELETE_RUSH_HOUR: (id) => `/api/settings/rush-hours/${id}`,
  UPDATE_CURRENCY: "/api/settings/currency",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "user_data", // Only store user data, not tokens
};

// Routes
export const ROUTES = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
  BOOKINGS: "/bookings",
  DRIVERS: "/drivers",
  CARS: "/cars",
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Driver Status
export const DRIVER_STATUS = {
  AVAILABLE: "available",
  ON_TRIP: "on_trip",
  OFFLINE: "offline",
};

// Vehicle Status
export const VEHICLE_STATUS = {
  AVAILABLE: "available",
  IN_USE: "in_use",
  MAINTENANCE: "maintenance",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};
