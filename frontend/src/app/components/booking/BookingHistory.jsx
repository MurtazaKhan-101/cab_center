"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getMyBookings } from "../../lib/booking";
import { Alert, Spinner } from "../ui";
import { useAuth } from "../../context/AuthContext";

export const BookingHistory = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      // Wait for auth to initialize
      if (authLoading) {
        return;
      }

      // Only fetch if user is authenticated
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMyBookings();
        if (response.success) {
          // Filter completed and cancelled bookings (history)
          const historyBookings = response.bookings.filter(
            (b) => b.status === "completed" || b.status === "cancelled"
          );
          setBookingHistory(historyBookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load booking history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authLoading, isAuthenticated]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    // If time is already in format "HH:MM", convert to 12-hour format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Show loading during auth initialization or data fetching
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            My History
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* History Cards Container */}
        <div className="space-y-3">
          {bookingHistory.map((booking, index) => (
            <div
              key={booking._id}
              className={`${
                index % 2 === 0 ? "bg-[#5C88D7]" : "bg-[#E5EAFF]"
              } rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01]`}
            >
              {/* Main Content */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Left Section - Location Info */}
                <div className="flex-1 space-y-2">
                  {/* Pickup Location */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 ${
                        index % 2 === 0 ? "bg-white" : "bg-[#5C88D7]"
                      } rounded-full shadow-sm`}
                    ></div>
                    <div className="flex-1">
                      <p
                        className={`${
                          index % 2 === 0 ? "text-white" : "text-gray-800"
                        } text-sm sm:text-base font-medium leading-relaxed`}
                      >
                        {booking.pickup}
                      </p>
                    </div>
                  </div>

                  {/* Destination Location */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 ${
                        index % 2 === 0 ? "bg-green-300" : "bg-green-500"
                      } rounded-full shadow-sm`}
                    ></div>
                    <div className="flex-1">
                      <p
                        className={`${
                          index % 2 === 0 ? "text-white" : "text-gray-800"
                        } text-sm sm:text-base font-medium leading-relaxed`}
                      >
                        {booking.drop}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Date, Time, Amount */}
                <div className="sm:text-right space-y-1.5 sm:min-w-[130px]">
                  {/* Date */}
                  <div className="flex sm:justify-end items-center gap-2">
                    <Calendar
                      className={`w-4 h-4 ${
                        index % 2 === 0 ? "text-white/80" : "text-gray-600"
                      }`}
                    />
                    <p
                      className={`${
                        index % 2 === 0 ? "text-white" : "text-gray-800"
                      } text-sm font-medium`}
                    >
                      {formatDate(booking.date)}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex sm:justify-end items-center gap-2">
                    <Clock
                      className={`w-4 h-4 ${
                        index % 2 === 0 ? "text-white/80" : "text-gray-600"
                      }`}
                    />
                    <p
                      className={`${
                        index % 2 === 0 ? "text-white" : "text-gray-800"
                      } text-sm font-medium`}
                    >
                      {formatTime(booking.time)}
                    </p>
                  </div>

                  {/* Amount */}
                  <div
                    className={`${
                      index % 2 === 0
                        ? "bg-white/20 text-white"
                        : "bg-[#5C88D7] text-white"
                    } backdrop-blur-sm rounded-lg px-3 py-1.5 sm:inline-block w-full sm:w-auto text-center`}
                  >
                    <p className="text-base sm:text-lg font-bold">
                      PKR {booking.total_fare}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (when no bookings) */}
        {bookingHistory.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No History Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You haven&apos;t made any bookings yet. Start by booking your
                first ride!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
