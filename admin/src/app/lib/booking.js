import apiClient from "./api";
import { API_ENDPOINTS } from "./constants";

// Get all bookings (admin)
export const getAllBookings = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BOOKINGS);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BOOKING_BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Approve a booking (assign driver and vehicle)
export const approveBooking = async (id, driverData) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.APPROVE_BOOKING(id),
      driverData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Reject a booking
export const rejectBooking = async (id, reason) => {
  try {
    const response = await apiClient.patch(API_ENDPOINTS.REJECT_BOOKING(id), {
      reason,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Complete a booking
export const completeBooking = async (id) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.COMPLETE_BOOKING(id),
      {}
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update a booking
export const updateBooking = async (id, bookingData) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.UPDATE_BOOKING(id),
      bookingData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_BOOKING(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Download receipt
export const downloadReceipt = async (id) => {
  try {
    const response = await fetch(
      `${apiClient.baseURL}${API_ENDPOINTS.DOWNLOAD_RECEIPT(id)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${apiClient.getAccessToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download receipt");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-receipt-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    throw error;
  }
};
