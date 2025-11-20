"use client";

import { useState } from "react";
import { MapPin, Clock, Calendar } from "lucide-react";

export const BookingHistory = () => {
  // Sample booking history data matching the design
  const [bookingHistory] = useState([
    {
      id: 1,
      pickup: "Aziziyah, Street no. 2",
      destination: "Al-Shaqiyah",
      date: "11/11/2025",
      time: "11:33 Pm",
      amount: "SAR 130"
    },
    {
      id: 2,
      pickup: "Aziziyah, Street no. 2", 
      destination: "Al-Shaqiyah",
      date: "11/11/2025",
      time: "11:33 Pm",
      amount: "SAR 130"
    },
    {
      id: 3,
      pickup: "Aziziyah, Street no. 2",
      destination: "Al-Shaqiyah", 
      date: "11/11/2025",
      time: "11:33 Pm",
      amount: "SAR 130"
    },
    {
      id: 4,
      pickup: "Aziziyah, Street no. 2",
      destination: "Al-Shaqiyah",
      date: "11/11/2025", 
      time: "11:33 Pm",
      amount: "SAR 130"
    },
    {
      id: 5,
      pickup: "Aziziyah, Street no. 2",
      destination: "Al-Shaqiyah",
      date: "11/11/2025",
      time: "11:33 Pm", 
      amount: "SAR 130"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            My History
          </h1>
        </div>

        {/* History Cards Container */}
        <div className="space-y-3">
          {bookingHistory.map((booking, index) => (
            <div
              key={booking.id}
              className={`${
                index % 2 === 0 
                  ? 'bg-[#5C88D7]' 
                  : 'bg-[#E5EAFF]'
              } rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01]`}
            >
              {/* Main Content */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Left Section - Location Info */}
                <div className="flex-1 space-y-2">
                  {/* Pickup Location */}
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#5C88D7]'
                    } rounded-full shadow-sm`}></div>
                    <div className="flex-1">
                      <p className={`${
                        index % 2 === 0 ? 'text-white' : 'text-gray-800'
                      } text-sm sm:text-base font-medium leading-relaxed`}>
                        {booking.pickup}
                      </p>
                    </div>
                  </div>

                  {/* Destination Location */}
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 ${
                      index % 2 === 0 ? 'bg-green-300' : 'bg-green-500'
                    } rounded-full shadow-sm`}></div>
                    <div className="flex-1">
                      <p className={`${
                        index % 2 === 0 ? 'text-white' : 'text-gray-800'
                      } text-sm sm:text-base font-medium leading-relaxed`}>
                        {booking.destination}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Date, Time, Amount */}
                <div className="sm:text-right space-y-1.5 sm:min-w-[130px]">
                  {/* Date */}
                  <div className="flex sm:justify-end items-center gap-2">
                    <Calendar className={`w-4 h-4 ${
                      index % 2 === 0 ? 'text-white/80' : 'text-gray-600'
                    }`} />
                    <p className={`${
                      index % 2 === 0 ? 'text-white' : 'text-gray-800'
                    } text-sm font-medium`}>
                      {booking.date}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex sm:justify-end items-center gap-2">
                    <Clock className={`w-4 h-4 ${
                      index % 2 === 0 ? 'text-white/80' : 'text-gray-600'
                    }`} />
                    <p className={`${
                      index % 2 === 0 ? 'text-white' : 'text-gray-800'
                    } text-sm font-medium`}>
                      {booking.time}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className={`${
                    index % 2 === 0 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#5C88D7] text-white'
                  } backdrop-blur-sm rounded-lg px-3 py-1.5 sm:inline-block w-full sm:w-auto text-center`}>
                    <p className="text-base sm:text-lg font-bold">
                      {booking.amount}
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
                You haven&apos;t made any bookings yet. Start by booking your first ride!
              </p>
            </div>
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {bookingHistory.length > 0 && (
          <div className="text-center mt-6">
            <button className="bg-[#5C88D7] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#4a75c4] transition-colors duration-200 shadow-md hover:shadow-lg">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;