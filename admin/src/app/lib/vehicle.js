import apiClient from "./api";
import { API_ENDPOINTS } from "./constants";

// Get all vehicles
export const getAllVehicles = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLES);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get available vehicles
export const getAvailableVehicles = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AVAILABLE_VEHICLES);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get vehicle types with pricing
export const getVehicleTypes = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_TYPES);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single vehicle by ID
export const getVehicleById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a new vehicle
export const createVehicle = async (vehicleData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.VEHICLES, vehicleData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update a vehicle
export const updateVehicle = async (id, vehicleData) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.UPDATE_VEHICLE(id),
      vehicleData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete a vehicle
export const deleteVehicle = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_VEHICLE(id));
    return response;
  } catch (error) {
    throw error;
  }
};
