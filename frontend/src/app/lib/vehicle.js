import apiClient from "./api";
import { API_ENDPOINTS } from "./constants";

// Get all vehicle types with pricing and availability
export const getVehicleTypes = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_TYPES);
    return response;
  } catch (error) {
    throw error;
  }
};
