import apiClient from "./api";
import { API_ENDPOINTS } from "./constants";

// Get all settings
export const getSettings = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SETTINGS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get rush hours
export const getRushHours = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.RUSH_HOURS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update base fare
export const updateBaseFare = async (baseFare) => {
  try {
    const response = await apiClient.patch(API_ENDPOINTS.UPDATE_BASE_FARE, {
      base_fare: baseFare,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Add rush hour
export const addRushHour = async (rushHourData) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.ADD_RUSH_HOUR,
      rushHourData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update rush hour
export const updateRushHour = async (id, rushHourData) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.UPDATE_RUSH_HOUR(id),
      rushHourData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete rush hour
export const deleteRushHour = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_RUSH_HOUR(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Update currency
export const updateCurrency = async (currency) => {
  try {
    const response = await apiClient.patch(API_ENDPOINTS.UPDATE_CURRENCY, {
      currency,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
