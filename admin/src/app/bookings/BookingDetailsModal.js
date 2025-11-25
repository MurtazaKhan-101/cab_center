"use client";

import { Button } from "../components/ui";
import { X, User, MapPin, Phone, Calendar, Clock, Car, CreditCard, Star, AlertCircle } from 'lucide-react';

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

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
        return <Clock className="w-4 h-4" />;
      case 'Confirmed':
        return <Car className="w-4 h-4" />;
      case 'In Process':
        return <MapPin className="w-4 h-4" />;
      case 'Completed':
        return <Star className="w-4 h-4" />;
      case 'Rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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
              Booking ID: #{booking.id.toString().padStart(4, '0')}
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
          {/* Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Status</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
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
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-gray-100">{booking.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{booking.phone}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Type</label>
                <p className="text-gray-900 dark:text-gray-100">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    booking.customerType === 'VIP' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {booking.customerType}
                  </span>
                </p>
              </div>
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
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pickup Location</label>
                <p className="text-gray-900 dark:text-gray-100">{booking.pickupPoint}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop Location</label>
                <p className="text-gray-900 dark:text-gray-100">{booking.dropPoint}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle Type</label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Car className="w-3 h-3" />
                  <span>{booking.vehicle}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{booking.date}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Time</label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{booking.time}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Distance</label>
                <p className="text-gray-900 dark:text-gray-100">{booking.distance}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Fare</label>
                <p className="text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                  <CreditCard className="w-3 h-3" />
                  <span>{booking.estimatedFare}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Information (if assigned) */}
          {(booking.assignedDriver || booking.assignedVehicle) && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <Car className="w-4 h-4 text-green-600" />
                <span>Assignment Details</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.assignedDriver && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Driver</label>
                    <p className="text-gray-900 dark:text-gray-100">{booking.assignedDriver}</p>
                  </div>
                )}
                {booking.assignedVehicle && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Vehicle</label>
                    <p className="text-gray-900 dark:text-gray-100">{booking.assignedVehicle}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Information (if rejected) */}
          {booking.status === 'Rejected' && booking.rejectReason && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Rejection Details</span>
              </h4>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Reason</label>
                <p className="text-gray-900 dark:text-gray-100">{booking.rejectReason}</p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {booking.notes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Additional Notes</h4>
              <p className="text-gray-900 dark:text-gray-100">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
          <Button
            onClick={onClose}
            variant="primary"
            className="px-6 py-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}