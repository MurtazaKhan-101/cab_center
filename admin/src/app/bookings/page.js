"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";
import { Search, Filter, Eye, Check, X, Clock, MapPin, Phone, Calendar, Car, User } from 'lucide-react';
import MainLayout from "../components/layout/MainLayout";
import AssignVehicleModal from "./AssignVehicleModal";
import BookingDetailsModal from "./BookingDetailsModal";
import { showToast } from '../lib/toast';

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Ahmed",
      pickupPoint: "street no.4",
      dropPoint: "Street no. 4",
      vehicle: "SUV",
      phone: "+9664567336",
      date: "24/11/2025",
      time: "10:00 PM",
      status: "Pending",
      customerType: "Regular",
      distance: "12.5 km",
      estimatedFare: "45 SAR",
      notes: "Please arrive 5 minutes early"
    },
    {
      id: 2,
      name: "Ahmed",
      pickupPoint: "street no.4",
      dropPoint: "Street no. 4",
      vehicle: "Mini Van",
      phone: "+9664567336",
      date: "24/11/2025",
      time: "10:00 PM",
      status: "Confirmed",
      customerType: "VIP",
      distance: "8.3 km",
      estimatedFare: "35 SAR",
      assignedDriver: "Ahmed Malik",
      assignedVehicle: "KSA 2370 - Hiace"
    },
    {
      id: 3,
      name: "Ahmed",
      pickupPoint: "street no.4",
      dropPoint: "Street no. 4",
      vehicle: "Sedan",
      phone: "+9664567336",
      date: "24/11/2025",
      time: "10:00 PM",
      status: "In Process",
      customerType: "Regular",
      distance: "15.2 km",
      estimatedFare: "52 SAR",
      assignedDriver: "Umair Musa",
      assignedVehicle: "KSA 2371 - Camry"
    },
    {
      id: 4,
      name: "Ahmed",
      pickupPoint: "street no.4",
      dropPoint: "Street no. 4",
      vehicle: "Mini Van",
      phone: "+9664567336",
      date: "24/11/2025",
      time: "10:00 PM",
      status: "Completed",
      customerType: "Regular",
      distance: "6.7 km",
      estimatedFare: "28 SAR",
      assignedDriver: "Ijaz Aslam",
      assignedVehicle: "KSA 2372 - Hiace"
    },
    {
      id: 5,
      name: "Ahmed",
      pickupPoint: "street no.4",
      dropPoint: "Street no. 4",
      vehicle: "SUV",
      phone: "+9664567336",
      date: "24/11/2025",
      time: "10:00 PM",
      status: "Rejected",
      customerType: "Regular",
      distance: "22.1 km",
      estimatedFare: "78 SAR",
      rejectReason: "No available drivers"
    },
    {
      id: 6,
      name: "Sarah Khan",
      pickupPoint: "King Fahd Road",
      dropPoint: "Riyadh Airport",
      vehicle: "Sedan",
      phone: "+9665551234",
      date: "25/11/2025",
      time: "08:30 AM",
      status: "Pending",
      customerType: "VIP",
      distance: "25.8 km",
      estimatedFare: "85 SAR",
      notes: "Airport transfer, heavy luggage"
    },
    {
      id: 7,
      name: "Omar Ali",
      pickupPoint: "Olaya District",
      dropPoint: "King Saud University",
      vehicle: "SUV",
      phone: "+9665552345",
      date: "25/11/2025",
      time: "09:15 AM",
      status: "Confirmed",
      customerType: "Regular",
      distance: "18.3 km",
      estimatedFare: "62 SAR",
      assignedDriver: "Hassan Afzal",
      assignedVehicle: "KSA 2375 - X7"
    },
    {
      id: 8,
      name: "Fatima Hassan",
      pickupPoint: "Downtown Mall",
      dropPoint: "Diplomatic Quarter",
      vehicle: "Mini Van",
      phone: "+9665553456",
      date: "25/11/2025",
      time: "02:45 PM",
      status: "In Process",
      customerType: "Regular",
      distance: "14.7 km",
      estimatedFare: "48 SAR",
      assignedDriver: "Ahmed Bilal",
      assignedVehicle: "KSA 2373 - Sitaria"
    },
    {
      id: 9,
      name: "Mohammed Yusuf",
      pickupPoint: "Business District",
      dropPoint: "Al Nakheel Mall",
      vehicle: "Sedan",
      phone: "+9665554567",
      date: "25/11/2025",
      time: "06:20 PM",
      status: "Completed",
      customerType: "Regular",
      distance: "11.2 km",
      estimatedFare: "38 SAR",
      assignedDriver: "Badar Islam",
      assignedVehicle: "KSA 2374 - Corolla"
    },
    {
      id: 10,
      name: "Layla Ahmed",
      pickupPoint: "Prince Sultan Road",
      dropPoint: "King Abdulaziz Hospital",
      vehicle: "SUV",
      phone: "+9665555678",
      date: "26/11/2025",
      time: "07:00 AM",
      status: "Pending",
      customerType: "VIP",
      distance: "19.5 km",
      estimatedFare: "68 SAR",
      notes: "Medical appointment, elderly passenger"
    },
    {
      id: 11,
      name: "Khalid Mansour",
      pickupPoint: "Exit 7",
      dropPoint: "KFUPM University",
      vehicle: "Mini Van",
      phone: "+9665556789",
      date: "26/11/2025",
      time: "11:30 AM",
      status: "Rejected",
      customerType: "Regular",
      distance: "45.2 km",
      estimatedFare: "125 SAR",
      rejectReason: "Distance too far"
    },
    {
      id: 12,
      name: "Nora Saleh",
      pickupPoint: "Granada Center",
      dropPoint: "Riyadh Park Mall",
      vehicle: "Sedan",
      phone: "+9665557890",
      date: "26/11/2025",
      time: "03:15 PM",
      status: "Confirmed",
      customerType: "Regular",
      distance: "13.8 km",
      estimatedFare: "42 SAR",
      assignedDriver: "Umair Musa",
      assignedVehicle: "KSA 2371 - Camry"
    },
    {
      id: 13,
      name: "Tariq Nasser",
      pickupPoint: "Al Malaz District",
      dropPoint: "King Khalid Airport",
      vehicle: "Mini Van",
      phone: "+9665558901",
      date: "27/11/2025",
      time: "05:45 AM",
      status: "In Process",
      customerType: "VIP",
      distance: "32.1 km",
      estimatedFare: "95 SAR",
      assignedDriver: "Muzammil",
      assignedVehicle: "KSA 2376 - Hiace"
    },
    {
      id: 14,
      name: "Amina Khalil",
      pickupPoint: "Al Yasmin District",
      dropPoint: "Centria Mall",
      vehicle: "SUV",
      phone: "+9665559012",
      date: "27/11/2025",
      time: "12:00 PM",
      status: "Completed",
      customerType: "Regular",
      distance: "16.4 km",
      estimatedFare: "56 SAR",
      assignedDriver: "Ahmed Malik",
      assignedVehicle: "KSA 2370 - Prado"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.pickupPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.dropPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.phone.includes(searchTerm);
    
    const matchesFilter = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Process':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3 h-3" />;
      case 'Confirmed':
        return <Check className="w-3 h-3" />;
      case 'In Process':
        return <Car className="w-3 h-3" />;
      case 'Completed':
        return <Check className="w-3 h-3" />;
      case 'Rejected':
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
                Are you sure you want to reject this booking? This action cannot be undone.
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "Rejected", rejectReason: "Rejected by admin" }
          : booking
      ));
      
      showToast.success("Booking rejected successfully!", toastId);
    } catch (error) {
      showToast.error("Failed to reject booking. Please try again.", toastId);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleAssignVehicle = async (bookingId, vehicleData) => {
    const toastId = showToast.loading("Assigning vehicle...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: "Confirmed",
              assignedDriver: vehicleData.driverName,
              assignedVehicle: `${vehicleData.registrationNumber} - ${vehicleData.model}`
            }
          : booking
      ));
      
      setShowAssignModal(false);
      setSelectedBooking(null);
      showToast.success("Vehicle assigned successfully!", toastId);
    } catch (error) {
      showToast.error("Failed to assign vehicle. Please try again.", toastId);
    }
  };

  const getStatsData = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'Pending').length,
      confirmed: bookings.filter(b => b.status === 'Confirmed').length,
      inProcess: bookings.filter(b => b.status === 'In Process').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
      rejected: bookings.filter(b => b.status === 'Rejected').length
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-white dark:text-white group-hover:text-white">{stats.total}</p>
              <p className="text-sm font-medium text-white dark:text-gray-400 group-hover:text-white/80">Total Bookings</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 group-hover:text-white">{stats.pending}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">Pending</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 group-hover:text-white">{stats.confirmed}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">Confirmed</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 group-hover:text-white">{stats.inProcess}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">In Process</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600 group-hover:text-white">{stats.completed}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">Completed</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 group-hover:text-white">{stats.rejected}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">Rejected</p>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Pickup point</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Drop point</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Vehicle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
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
                        {booking.status === 'Pending' && (
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
                Showing {Math.min(filteredBookings.length, itemsPerPage)} of {filteredBookings.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="px-3 py-1 text-sm text-white bg-buttons-gradient disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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