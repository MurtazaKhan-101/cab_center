import apiClient from "./api";
import { API_ENDPOINTS } from "./constants";

// Get system settings (including rush hours)
export const getSettings = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.GET_SETTINGS, {
      includeAuth: false, // Public endpoint
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get rush hours
export const getRushHours = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.GET_RUSH_HOURS, {
      includeAuth: false, // Public endpoint
    });
    return response;
  } catch (error) {
    throw error;
  }
};
