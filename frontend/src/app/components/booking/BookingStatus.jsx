"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button, Card, Spinner, Alert } from "../ui";
import PaginationWithI18n from "../ui/PaginationWithI18n";
import { getMyBookings } from "../../lib/booking";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "../../../lib/i18n";

export const BookingStatus = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { t, isRTL } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const [bookings, setBookings] = useState([]);
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
          // Filter for pending, approved, and rejected bookings (recent/active bookings)
          const activeBookings = response.bookings.filter(
            (b) =>
              b.status === "pending" ||
              b.status === "approved" ||
              b.status === "rejected"
          );
          setBookings(activeBookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(t('messages.fetch_error_status'));
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authLoading, isAuthenticated, t]);

  // Calculate pagination
  const totalPages = Math.ceil(bookings.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    let statusDisplay;

    switch (statusLower) {
      case "approved":     
        statusDisplay = t('booking_status.status_approved');
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {statusDisplay}
          </span>
        );
      case "pending":
        statusDisplay = t('booking_status.status_pending');
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {statusDisplay}
          </span>
        );
      case "rejected":
        statusDisplay = t('booking_status.status_rejected');
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {statusDisplay}
          </span>
        );
      case "cancelled":
        statusDisplay = t('booking_status.status_cancelled');
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {statusDisplay}
          </span>
        );
      default:
        statusDisplay = t('booking_status.status_unknown');
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {statusDisplay}
          </span>
        );
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleBookNow = () => {
    window.location.href = "/dashboard";
  };

  // Show loading during auth initialization or data fetching
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 ${isRTL() ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Main Card Container */}
        <Card className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {error && (
              <div className="mb-4">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center sm:text-left">
                {t('booking_status.title')}
              </h1>
              <Button
                onClick={handleBookNow}
                className="bg-[#00188F] hover:bg-[#000729] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2 border-none text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>{t('booking_status.book_now_button')}</span>
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#5C88D7] text-white">
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    {t('booking_status.table_sr')}
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    {t('booking_status.table_pickup')}
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    {t('booking_status.table_destination')}
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    {t('booking_status.table_date')}
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    {t('booking_status.table_time')}
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    {t('booking_status.table_status')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {t('booking_status.no_active_bookings')}
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-blue-50 dark:bg-blue-900/10"
                          : "bg-white dark:bg-gray-900"
                      } border-b border-gray-200 dark:border-gray-700`}
                    >
                      <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {booking.pickup}
                      </td>
                      <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {booking.drop}
                      </td>
                      <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(booking.date)}
                      </td>
                      <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                        {formatTime(booking.time)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {getStatusBadge(booking.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {currentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('booking_status.no_active_bookings')}
              </div>
            ) : (
              currentBookings.map((booking, index) => (
                <div
                  key={booking._id}
                  className={`p-4 rounded-lg border ${
                    index % 2 === 0
                      ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#5C88D7] text-white px-3 py-1 rounded text-sm font-medium">
                      #{startIndex + index + 1}
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t('booking_status.table_pickup')}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {booking.pickup}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t('booking_status.table_destination')}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {booking.drop}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t('booking_status.table_date')}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(booking.date)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t('booking_status.table_time')}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatTime(booking.time)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Pagination */}
          <PaginationWithI18n
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={bookings.length}
            itemsPerPage={entriesPerPage}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </Card>
      </div>
    </div>
  );
};

export default BookingStatus;