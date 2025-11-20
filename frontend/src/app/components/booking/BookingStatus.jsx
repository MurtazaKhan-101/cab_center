"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button, Card } from "../ui";

export const BookingStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  
  // Sample booking data - matching the design
  const [bookings] = useState([
    {
      id: 1,
      pickup: "Aziziyah",
      destination: "Al-Shaqiyah",
      date: "11/11/2025",
      time: "12:33 PM",
      status: "Pending"
    },
    {
      id: 2,
      pickup: "Al-Shaqiyah", 
      destination: "Clock Tower",
      date: "07/11/2025",
      time: "10:56 PM",
      status: "Approved"
    },
    {
      id: 3,
      pickup: "Al-Kayliyah",
      destination: "Time Ruba Hote...",
      date: "29/10/2025", 
      time: "12:01 AM",
      status: "Pending"
    },
    {
      id: 4,
      pickup: "Al-Shaqiyah",
      destination: "Clock Tower",
      date: "07/11/2025",
      time: "10:56 PM", 
      status: "Approved"
    }
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(bookings.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-500 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {status}
          </span>
        );
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleBookNow = () => {
    console.log("Book Now clicked");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900  p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Card Container */}
        <Card className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center sm:text-left">
                Booking Status
              </h1>
              <Button
                onClick={handleBookNow}
                className="bg-[#00188F] hover:bg-[#000729] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2 border-none text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Book Now</span>
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#5C88D7] text-white">
                  <th className="px-6 py-3 text-center text-sm font-semibold">Sr.</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Pickup</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Destination</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Time</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking, index) => (
                  <tr 
                    key={booking.id}
                    className={`${
                      index % 2 === 0 
                        ? 'bg-blue-50 dark:bg-blue-900/10' 
                        : 'bg-white dark:bg-gray-900'
                    } border-b border-gray-200 dark:border-gray-700`}
                  >
                    <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                      {booking.pickup}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                      {booking.destination}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                      {booking.date}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                      {booking.time}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {getStatusBadge(booking.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {currentBookings.map((booking, index) => (
              <div 
                key={booking.id} 
                className={`p-4 rounded-lg border ${
                  index % 2 === 0 
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
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
                    <span className="text-gray-600 dark:text-gray-400 block mb-1">Pickup</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.pickup}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-1">Destination</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.destination}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-1">Date</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.date}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-1">Time</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with Pagination */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Entry count */}
              <p className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                Showing {Math.min(currentBookings.length, entriesPerPage)} of {bookings.length} entries
              </p>
              
              {/* Pagination controls */}
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 border-none"
                >
                  ← Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 border-none"
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingStatus;