"use client";

import { Button } from "../components/ui";
import {
  X,
  User,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Car,
  CreditCard,
  Star,
  AlertCircle,
  Plane,
  Baby,
  MessageSquare,
  UserCheck,
  RotateCcw,
  Timer,
  Mail,
} from "lucide-react";

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Approved":
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "In Process":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "Rejected":
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Approved":
      case "Confirmed":
        return <Car className="w-4 h-4" />;
      case "In Process":
        return <MapPin className="w-4 h-4" />;
      case "Completed":
        return <Star className="w-4 h-4" />;
      case "Rejected":
      case "Cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const serviceLabel = booking.serviceType === "hourly" ? "Hourly Chauffeur" : "Transfer";
  const hasExtras = booking.flightNumber || booking.childSeat || booking.driverNotes || booking.meetGreetName;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-secondary p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Booking Details</span>
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Booking ID: #{booking.id?.toString().slice(-6).toUpperCase() || '—'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Service Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Status
              </h3>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                {serviceLabel}
              </span>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusIcon(booking.status)}
              <span className="ml-1.5">{booking.status}</span>
            </span>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Customer Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Name
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {booking.firstName && booking.lastName
                    ? `${booking.firstName} ${booking.lastName}`
                    : booking.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Phone
                </label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{booking.phone}</span>
                </p>
              </div>
              {booking.email && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{booking.email}</span>
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Customer Type
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      booking.customerType === "Guest"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                    }`}
                  >
                    {booking.customerType}
                  </span>
                </p>
              </div>
              {booking.passengers && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Passengers
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{booking.passengers}</p>
                </div>
              )}
            </div>
          </div>

          {/* Trip Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Trip Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pickup Location
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {booking.pickupPoint}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Drop Location
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {booking.dropPoint}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Vehicle Type
                </label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Car className="w-3 h-3" />
                  <span>{booking.vehicle}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{booking.date}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Time
                </label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{booking.time}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Distance
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {booking.distance}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Payment Method
                </label>
                <p className="text-gray-900 dark:text-gray-100 capitalize">
                  {booking.paymentMethod}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Fare
                </label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <CreditCard className="w-3 h-3" />
                  <span>{booking.estimatedFare}</span>
                </p>
              </div>
              {booking.durationHours && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Duration
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                    <Timer className="w-3 h-3" />
                    <span>{booking.durationHours} hours</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Round Trip Info */}
          {booking.isRoundTrip && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>Round Trip Return</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.returnDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Return Date
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{booking.returnDate}</p>
                  </div>
                )}
                {booking.returnTime && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Return Time
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{booking.returnTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Extras */}
          {hasExtras && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-600" />
                <span>Extras &amp; Add-ons</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.flightNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Flight Number
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                      <Plane className="w-3 h-3" />
                      <span>{booking.flightNumber}</span>
                    </p>
                  </div>
                )}
                {booking.childSeat && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Child Seat
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                      <Baby className="w-3 h-3" />
                      <span>Requested</span>
                    </p>
                  </div>
                )}
                {booking.meetGreetName && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Meet &amp; Greet Name
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                      <UserCheck className="w-3 h-3" />
                      <span>{booking.meetGreetName}</span>
                    </p>
                  </div>
                )}
                {booking.driverNotes && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Driver Notes
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-start space-x-1">
                      <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{booking.driverNotes}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignment Information */}
          {(booking.assignedDriver || booking.assignedVehicle) && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <Car className="w-4 h-4 text-green-600" />
                <span>Assignment Details</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.assignedDriver && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Assigned Driver
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {booking.assignedDriver}
                    </p>
                  </div>
                )}
                {booking.assignedVehicle && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Assigned Vehicle
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {booking.assignedVehicle}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Information */}
          {booking.status === "Rejected" && booking.rejectReason && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Rejection Details</span>
              </h4>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Reason
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {booking.rejectReason}
                </p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {booking.notes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Additional Notes
              </h4>
              <p className="text-gray-900 dark:text-gray-100">
                {booking.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
          <Button onClick={onClose} variant="primary" className="px-6 py-2">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
