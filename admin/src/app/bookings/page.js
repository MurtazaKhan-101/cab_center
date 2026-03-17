"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button, Spinner } from "../components/ui";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Car,
  User,
  Download,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import AssignVehicleModal from "./AssignVehicleModal";
import BookingDetailsModal from "./BookingDetailsModal";
import { showToast } from "../lib/toast";
import * as bookingService from "../lib/booking";

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 5;

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await bookingService.getAllBookings();
        if (response.success) {
          // Transform backend data to frontend format
          const transformedBookings = response.bookings.map((b) => ({
            id: b._id,
            name: b.user_name || `${b.first_name || ''} ${b.last_name || ''}`.trim() || 'Guest',
            firstName: b.first_name || '',
            lastName: b.last_name || '',
            pickupPoint: b.pickup,
            dropPoint: b.drop,
            vehicleType: b.vehicle_type,
            vehicle:
              b.vehicle_type.charAt(0).toUpperCase() + b.vehicle_type.slice(1).replace(/_/g, ' '),
            phone: b.contact_number,
            date: new Date(b.date).toLocaleDateString("en-GB"),
            time: b.time,
            paymentMethod: b.payment_method,
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
            rawStatus: b.status,
            customerType: b.user_id ? "Registered" : "Guest",
            distance: `${b.distance_km} km`,
            estimatedFare: `SAR ${b.total_fare}`,
            assignedDriver: b.driver_id?.name || null,
            assignedVehicle: b.vehicle_id
              ? `${b.vehicle_id.registration_number} - ${b.vehicle_id.model}`
              : null,
            passengers: b.no_of_passengers,
            email: b.email,
            notes: b.special_requirements,
            serviceType: b.service_type || 'transfer',
            flightNumber: b.flight_number || '',
            childSeat: b.child_seat || false,
            driverNotes: b.driver_notes || '',
            meetGreetName: b.meet_greet_name || '',
            isRoundTrip: b.is_round_trip || false,
            returnDate: b.return_date ? new Date(b.return_date).toLocaleDateString("en-GB") : '',
            returnTime: b.return_time || '',
            durationHours: b.duration_hours || null,
          }));
          setBookings(transformedBookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        showToast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  if (!mounted || authLoading || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);

    const matchesFilter =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in process":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "approved":
      case "confirmed":
      case "completed":
        return <Check className="w-3 h-3" />;
      case "in process":
        return <Car className="w-3 h-3" />;
      case "rejected":
      case "cancelled":
        return <X className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const handleAcceptBooking = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };

  const handleRejectBooking = async (bookingId) => {
    // Show confirmation toast using the existing toast system
    showToast.custom(
      (t) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 max-w-md">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Reject Booking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Are you sure you want to reject this booking? This action cannot
                be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    showToast.dismiss(t.id);
                    proceedWithReject(bookingId);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                >
                  Yes, Reject
                </button>
                <button
                  onClick={() => {
                    showToast.dismiss(t.id);
                    showToast.info("Booking rejection cancelled");
                  }}
                  className="px-3 py-1.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const proceedWithReject = async (bookingId) => {
    const toastId = showToast.loading("Rejecting booking...");

    try {
      // Find the actual MongoDB _id
      const booking = bookings.find((b) => b.id === bookingId);
      await bookingService.rejectBooking(booking.id, "Rejected by admin");

      setBookings(
        bookings.map((b) =>
          b.id === bookingId
            ? { ...b, status: "Rejected", rejectReason: "Rejected by admin" }
            : b
        )
      );

      showToast.success("Booking rejected successfully!", toastId);
    } catch (error) {
      console.error("Error rejecting booking:", error);
      showToast.error("Failed to reject booking. Please try again.", toastId);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCompleteBooking = async (bookingId) => {
    const toastId = showToast.loading("Completing booking...");

    try {
      const booking = bookings.find((b) => b.id === bookingId);
      await bookingService.completeBooking(booking.id);

      setBookings(
        bookings.map((b) =>
          b.id === bookingId
            ? { ...b, status: "Completed", rawStatus: "completed" }
            : b
        )
      );

      showToast.success(
        "Booking completed successfully! Driver and vehicle are now available.",
        toastId
      );
    } catch (error) {
      console.error("Error completing booking:", error);
      showToast.error("Failed to complete booking. Please try again.", toastId);
    }
  };

  const handleDownloadReceipt = async (bookingId) => {
    const toastId = showToast.loading("Downloading receipt...");

    try {
      const booking = bookings.find((b) => b.id === bookingId);
      await bookingService.downloadReceipt(booking.id);
      showToast.success("Receipt downloaded successfully!", toastId);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      showToast.error("Failed to download receipt. Please try again.", toastId);
    }
  };

  const handleAssignVehicle = async (bookingId, vehicleData) => {
    const toastId = showToast.loading("Assigning vehicle...");

    try {
      // Approve booking with driver and vehicle assignment
      const booking = bookings.find((b) => b.id === bookingId);
      await bookingService.approveBooking(booking.id, {
        driver_id: vehicleData.driverId,
        vehicle_id: vehicleData.vehicleId,
      });

      setBookings(
        bookings.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: "Approved",
                assignedDriver: vehicleData.driverName,
                assignedVehicle: `${vehicleData.registrationNumber} - ${vehicleData.model}`,
              }
            : b
        )
      );

      setShowAssignModal(false);
      setSelectedBooking(null);
      showToast.success("Vehicle assigned successfully!", toastId);

      // Refresh bookings to get updated data
      const response = await bookingService.getAllBookings();
      if (response.success) {
        const transformedBookings = response.bookings.map((b) => ({
          id: b._id,
          name: b.user_name || `${b.first_name || ''} ${b.last_name || ''}`.trim() || 'Guest',
          firstName: b.first_name || '',
          lastName: b.last_name || '',
          pickupPoint: b.pickup,
          dropPoint: b.drop,
          vehicleType: b.vehicle_type,
          vehicle:
            b.vehicle_type.charAt(0).toUpperCase() + b.vehicle_type.slice(1).replace(/_/g, ' '),
          phone: b.contact_number,
          date: new Date(b.date).toLocaleDateString("en-GB"),
          time: b.time,
          paymentMethod: b.payment_method,
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          rawStatus: b.status,
          customerType: b.user_id ? "Registered" : "Guest",
          distance: `${b.distance_km} km`,
          estimatedFare: `SAR ${b.total_fare}`,
          assignedDriver: b.driver_id?.name || null,
          assignedVehicle: b.vehicle_id
            ? `${b.vehicle_id.registration_number} - ${b.vehicle_id.model}`
            : null,
          passengers: b.no_of_passengers,
          email: b.email,
          notes: b.special_requirements,
          serviceType: b.service_type || 'transfer',
          flightNumber: b.flight_number || '',
          childSeat: b.child_seat || false,
          driverNotes: b.driver_notes || '',
          meetGreetName: b.meet_greet_name || '',
          isRoundTrip: b.is_round_trip || false,
          returnDate: b.return_date ? new Date(b.return_date).toLocaleDateString("en-GB") : '',
          returnTime: b.return_time || '',
          durationHours: b.duration_hours || null,
        }));
        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error("Error assigning vehicle:", error);
      showToast.error("Failed to assign vehicle. Please try again.", toastId);
    }
  };

  const getStatsData = () => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.rawStatus === "pending").length,
      approved: bookings.filter((b) => b.rawStatus === "approved").length,
      completed: bookings.filter((b) => b.rawStatus === "completed").length,
      rejected: bookings.filter((b) => b.rawStatus === "rejected").length,
      cancelled: bookings.filter((b) => b.rawStatus === "cancelled").length,
    };
  };

  const stats = getStatsData();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Booking Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage customer bookings and assignments
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-white dark:text-white group-hover:text-white">
                {stats.total}
              </p>
              <p className="text-sm font-medium text-white dark:text-gray-400 group-hover:text-white/80">
                Total Bookings
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 group-hover:text-white">
                {stats.pending}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                Pending
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 group-hover:text-white">
                {stats.approved}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                Approved
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600 group-hover:text-white">
                {stats.completed}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                Completed
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 group-hover:text-white">
                {stats.rejected}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                Rejected
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600 group-hover:text-white">
                {stats.cancelled}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                Cancelled
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, pickup, drop point, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Process">In Process</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white dark:bg-gray-800  rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Pickup point
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Drop point
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="p-4 md:p-6 bg-dark:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 border-b border-table last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.pickupPoint}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.dropPoint}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.vehicle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.time}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1.5">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleAcceptBooking(booking)}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                              title="Accept & Assign Vehicle"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Reject Booking"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {booking.status === "Approved" && (
                          <button
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                            title="Complete Booking"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        {booking.status === "Approved" && (
                          <button
                            onClick={() => handleDownloadReceipt(booking.id)}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-secondary px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-white">
                Showing {Math.min(filteredBookings.length, itemsPerPage)} of{" "}
                {filteredBookings.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  variant="outline"
                  className="px-3 py-1 text-sm text-white bg-buttons-gradient disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="px-3 py-1 text-sm bg-buttons-gradient text-white  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <AssignVehicleModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onAssign={handleAssignVehicle}
        />

        <BookingDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
        />
      </div>
    </MainLayout>
  );
}
