import apiClient from "./api";
import { API_ENDPOINTS } from "./constants";

// Calculate fare
export const calculateFare = async (fareData) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.CALCULATE_FARE,
      fareData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.CREATE_BOOKING,
      bookingData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user's bookings
export const getMyBookings = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MY_BOOKINGS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.GET_BOOKING(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (id) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.CANCEL_BOOKING(id),
      {}
    );
    return response;
  } catch (error) {
    throw error;
  }
};
