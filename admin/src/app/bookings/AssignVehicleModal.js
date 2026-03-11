"use client";

import { useState, useEffect } from "react";
import { Button, Spinner } from "../components/ui";
import {
  X,
  Car,
  User,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import { showToast } from "../lib/toast";
import * as driverService from "../lib/driver";

export default function AssignVehicleModal({
  isOpen,
  onClose,
  booking,
  onAssign,
}) {
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for available vehicles with drivers based on category
  const mockVehicleData = {
    SUV: [
      {
        id: 1,
        registrationNumber: "KSA 2370",
        model: "Prado",
        year: 2022,
        category: "SUV",
        driverName: "Ahmed Malik",
        driverPhone: "+966501234567",
        driverRating: 4.8,
        driverExperience: "5 years",
        lastLocation: "King Fahd Road",
        estimatedArrival: "8 minutes",
        totalTrips: 342,
        status: "Available",
      },
      {
        id: 2,
        registrationNumber: "KSA 2375",
        model: "X7",
        year: 2020,
        category: "SUV",
        driverName: "Hassan Afzal",
        driverPhone: "+966507654321",
        driverRating: 4.6,
        driverExperience: "3 years",
        lastLocation: "Olaya District",
        estimatedArrival: "12 minutes",
        totalTrips: 198,
        status: "Available",
      },
    ],
    Sedan: [
      {
        id: 3,
        registrationNumber: "KSA 2371",
        model: "Camry",
        year: 2021,
        category: "Sedan",
        driverName: "Umair Musa",
        driverPhone: "+966509876543",
        driverRating: 4.9,
        driverExperience: "7 years",
        lastLocation: "Business District",
        estimatedArrival: "5 minutes",
        totalTrips: 567,
        status: "Available",
      },
      {
        id: 4,
        registrationNumber: "KSA 2374",
        model: "Corolla",
        year: 2018,
        category: "Sedan",
        driverName: "Badar Islam",
        driverPhone: "+966502345678",
        driverRating: 4.7,
        driverExperience: "4 years",
        lastLocation: "Downtown",
        estimatedArrival: "15 minutes",
        totalTrips: 289,
        status: "Available",
      },
    ],
    "Mini Van": [
      {
        id: 5,
        registrationNumber: "KSA 2372",
        model: "Hiace",
        year: 2009,
        category: "Mini Van",
        driverName: "Ijaz Aslam",
        driverPhone: "+966505432167",
        driverRating: 4.5,
        driverExperience: "8 years",
        lastLocation: "Airport Road",
        estimatedArrival: "18 minutes",
        totalTrips: 756,
        status: "Available",
      },
      {
        id: 6,
        registrationNumber: "KSA 2376",
        model: "Hiace",
        year: 2022,
        category: "Mini Van",
        driverName: "Muzammil",
        driverPhone: "+966508765432",
        driverRating: 4.4,
        driverExperience: "2 years",
        lastLocation: "King Khalid Airport",
        estimatedArrival: "25 minutes",
        totalTrips: 134,
        status: "Available",
      },
      {
        id: 7,
        registrationNumber: "KSA 2373",
        model: "Sitaria",
        year: 2012,
        category: "Mini Van",
        driverName: "Ahmed Bilal",
        driverPhone: "+966503456789",
        driverRating: 4.6,
        driverExperience: "6 years",
        lastLocation: "Diplomatic Quarter",
        estimatedArrival: "10 minutes",
        totalTrips: 423,
        status: "Available",
      },
    ],
  };

  useEffect(() => {
    const fetchAvailableDrivers = async () => {
      if (!isOpen || !booking) return;

      setLoading(true);
      try {
        const response = await driverService.getAvailableDrivers();
        if (response.success) {
          // Filter drivers with vehicles matching the requested category
          const vehicleType = booking.vehicle.toLowerCase();
          const matchingDrivers = response.drivers.filter(
            (driver) =>
              driver.assigned_vehicle_id &&
              driver.assigned_vehicle_id.vehicle_type.toLowerCase() ===
                vehicleType &&
              driver.availability_status === "available"
          );

          setAvailableDrivers(matchingDrivers);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        showToast.error("Failed to load available drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDrivers();
  }, [isOpen, booking]);

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
  };

  const handleAssign = async () => {
    if (!selectedDriver) {
      showToast.error("Please select a driver");
      return;
    }

    await onAssign(booking.id, {
      driverId: selectedDriver._id,
      vehicleId: selectedDriver.assigned_vehicle_id._id,
      driverName: selectedDriver.name,
      driverPhone: selectedDriver.contact_number,
      registrationNumber:
        selectedDriver.assigned_vehicle_id.registration_number,
      model: selectedDriver.assigned_vehicle_id.model,
      vehicleType: selectedDriver.assigned_vehicle_id.vehicle_type,
    });
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-secondary p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Car className="w-5 h-5" />
              <span>Assign Vehicle & Driver</span>
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Available {booking.vehicle} vehicles for this booking
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Details Summary */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Customer: {booking.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {booking.pickupPoint} → {booking.dropPoint}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {booking.date} at {booking.time}
              </span>
            </div>
          </div>
        </div>

        {/* Available Drivers */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Available {booking.vehicle} Drivers ({availableDrivers.length})
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="md" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading available drivers...
              </span>
            </div>
          ) : availableDrivers.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Available Drivers
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                No drivers with {booking.vehicle} vehicles are currently
                available for assignment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedDriver?._id === driver._id
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200 dark:border-gray-600 hover:border-secondary/50"
                  }`}
                  onClick={() => handleSelectDriver(driver)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Vehicle Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center space-x-2">
                            <Car className="w-4 h-4" />
                            <span>
                              {driver.assigned_vehicle_id.registration_number} -{" "}
                              {driver.assigned_vehicle_id.model}
                            </span>
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <p>
                              Year: {driver.assigned_vehicle_id.year || "N/A"}
                            </p>
                            <p>
                              Category:{" "}
                              {driver.assigned_vehicle_id.vehicle_type
                                .charAt(0)
                                .toUpperCase() +
                                driver.assigned_vehicle_id.vehicle_type.slice(
                                  1
                                )}
                            </p>
                            <p>
                              Capacity: {driver.assigned_vehicle_id.capacity}{" "}
                              passengers
                            </p>
                            <p className="text-green-600 dark:text-green-400 font-medium">
                              Status: Available
                            </p>
                          </div>
                        </div>

                        {/* Driver Info */}
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{driver.name}</span>
                          </h5>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{driver.contact_number}</span>
                            </div>
                            <p>License: {driver.license_number}</p>
                            {driver.experience_years && (
                              <p>Experience: {driver.experience_years} years</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className="ml-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedDriver?._id === driver._id
                            ? "border-secondary bg-secondary"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedDriver?._id === driver._id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <Button onClick={onClose} variant="outline" className="px-6 py-2">
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedDriver || loading}
            className="bg-buttons-gradient hover:bg-buttons-gradient-hover text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign Driver & Vehicle
          </Button>
        </div>
      </div>
    </div>
  );
}
