import apiClient from "./api";
import { API_ENDPOINTS } from "./constants";

// Get all drivers
export const getAllDrivers = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DRIVERS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get available drivers
export const getAvailableDrivers = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AVAILABLE_DRIVERS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single driver by ID
export const getDriverById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DRIVER_BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a new driver
export const createDriver = async (driverData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.DRIVERS, driverData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update a driver
export const updateDriver = async (id, driverData) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.UPDATE_DRIVER(id),
      driverData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update driver attendance
export const updateDriverAttendance = async (id, attendanceData) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.UPDATE_DRIVER_ATTENDANCE(id),
      attendanceData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete a driver
export const deleteDriver = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_DRIVER(id));
    return response;
  } catch (error) {
    throw error;
  }
};
