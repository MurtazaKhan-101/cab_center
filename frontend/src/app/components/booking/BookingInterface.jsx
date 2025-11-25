"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  MessageSquare,
} from "lucide-react";
import { Button, Input, Alert, Spinner } from "../ui";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { createBooking } from "../../lib/booking";
import { getVehicleTypes } from "../../lib/vehicle";

export default function BookingInterface() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengerName: "",
    contactNumber: "",
    email: user?.email || "",
    numberOfPassengers: "",
    specialRequirements: "",
    selectedVehicle: null,
    distanceKm: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch vehicle types on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      const fallbackVehicles = [
        {
          id: "sedan",
          name: "Sedan",
          price: "PKR 50/km",
          farePerKm: 50,
          image: "/images/sedan.svg",
          seats: 4,
          capacity: "4 seats",
        },
        {
          id: "suv",
          name: "SUV",
          price: "PKR 80/km",
          farePerKm: 80,
          image: "/images/suv.svg",
          seats: 6,
          capacity: "6 seats",
        },
        {
          id: "luxury",
          name: "Luxury",
          price: "PKR 150/km",
          farePerKm: 150,
          image: "/images/hiace.svg",
          seats: 4,
          capacity: "4 seats",
        },
      ];

      try {
        const response = await getVehicleTypes();
        if (
          response.success &&
          response.vehicleTypes &&
          response.vehicleTypes.length > 0
        ) {
          // Map backend vehicle data to frontend format
          const vehicleData = response.vehicleTypes.map((v) => ({
            id: v.vehicle_type,
            name:
              v.vehicle_type.charAt(0).toUpperCase() + v.vehicle_type.slice(1),
            price: `PKR ${v.fare_per_km}/km`,
            farePerKm: v.fare_per_km,
            image: `/images/${v.vehicle_type}.svg`,
            seats: v.capacity,
            capacity: `${v.capacity} seats`,
            available: v.available_count,
          }));
          setVehicles(vehicleData);
        } else {
          // Use fallback if backend returns empty array
          console.log("No vehicle types from backend, using fallback");
          setVehicles(fallbackVehicles);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        // Fallback to default vehicles if API fails
        setVehicles(fallbackVehicles);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Update email when user changes
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear alert when user makes changes
    if (alert) {
      setAlert(null);
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedVehicle: prev.selectedVehicle === vehicleId ? null : vehicleId,
    }));
    // Clear vehicle selection error
    if (errors.selectedVehicle) {
      setErrors((prev) => ({ ...prev, selectedVehicle: "" }));
    }
    if (alert) {
      setAlert(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Location validation
    if (!formData.from.trim()) {
      newErrors.from = "Pickup location is required";
    } else if (formData.from.trim().length < 3) {
      newErrors.from = "Pickup location must be at least 3 characters";
    }

    if (!formData.to.trim()) {
      newErrors.to = "Destination is required";
    } else if (formData.to.trim().length < 3) {
      newErrors.to = "Destination must be at least 3 characters";
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = "Time is required";
    } else if (formData.date) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        newErrors.time = "Time must be in the future";
      }
    }

    // Passenger details validation
    if (!formData.passengerName.trim()) {
      newErrors.passengerName = "Passenger name is required";
    } else if (formData.passengerName.trim().length < 2) {
      newErrors.passengerName = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.passengerName.trim())) {
      newErrors.passengerName = "Name can only contain letters and spaces";
    }

    // Contact number validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (
      !/^(\+92|0)[0-9]{10}$/.test(formData.contactNumber.replace(/\s/g, ""))
    ) {
      newErrors.contactNumber =
        "Please enter a valid Pakistani mobile number (+92XXXXXXXXXX or 03XXXXXXXXX)";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Number of passengers validation
    if (!formData.numberOfPassengers.trim()) {
      newErrors.numberOfPassengers = "Number of passengers is required";
    } else {
      const passengerCount = parseInt(formData.numberOfPassengers);
      if (isNaN(passengerCount) || passengerCount < 1) {
        newErrors.numberOfPassengers = "Must be at least 1 passenger";
      } else if (passengerCount > 20) {
        newErrors.numberOfPassengers = "Maximum 20 passengers allowed";
      } else if (formData.selectedVehicle) {
        const selectedVehicle = vehicles.find(
          (v) => v.id === formData.selectedVehicle
        );
        if (selectedVehicle && passengerCount > selectedVehicle.seats) {
          newErrors.numberOfPassengers = `Selected vehicle can only accommodate ${selectedVehicle.seats} passengers`;
        }
      }
    }

    // Distance validation
    if (!formData.distanceKm.trim()) {
      newErrors.distanceKm = "Estimated distance is required";
    } else {
      const distance = parseFloat(formData.distanceKm);
      if (isNaN(distance) || distance <= 0) {
        newErrors.distanceKm = "Distance must be a positive number";
      } else if (distance > 1000) {
        newErrors.distanceKm = "Maximum distance is 1000 km";
      }
    }

    // Vehicle selection validation
    if (!formData.selectedVehicle) {
      newErrors.selectedVehicle = "Please select a vehicle";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookRide = async () => {
    setAlert(null);

    if (!validateForm()) {
      setAlert({
        type: "error",
        message: "Please correct the errors below and try again.",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Prepare booking data for API
      const bookingData = {
        user_name: formData.passengerName.trim(),
        contact_number: formData.contactNumber.trim(),
        email: formData.email.trim(),
        no_of_passengers: parseInt(formData.numberOfPassengers),
        special_requirements: formData.specialRequirements.trim(),
        pickup: formData.from.trim(),
        drop: formData.to.trim(),
        distance_km: parseFloat(formData.distanceKm),
        vehicle_type: formData.selectedVehicle,
        date: formData.date,
        time: formData.time,
      };

      const response = await createBooking(bookingData);

      if (response.success) {
        setAlert({
          type: "success",
          message: `Booking request submitted successfully! Estimated fare: PKR ${response.booking.total_fare}. You will receive a confirmation via email shortly.`,
        });

        // Reset form
        setFormData({
          from: "",
          to: "",
          date: "",
          time: "",
          passengerName: "",
          contactNumber: "",
          email: user?.email || "",
          numberOfPassengers: "",
          specialRequirements: "",
          selectedVehicle: null,
          distanceKm: "",
        });
      } else {
        setAlert({
          type: "error",
          message:
            response.message || "Failed to submit booking. Please try again.",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      setAlert({
        type: "error",
        message: error.message || "Failed to submit booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 h-full">
          {/* Left Side - Map */}
          <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg overflow-hidden order-2 lg:order-1">
            <div className="relative h-[300px] sm:h-[400px] lg:h-full">
              {/* Map Container */}
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Image
                  src="/images/map.svg"
                  alt="Map"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover opacity-50"
                />
              </div>

              {/* Route Visualization */}
              <div className="absolute inset-4 flex flex-col justify-between">
                {/* Destination */}
                <div className="flex items-center gap-3 justify-end">
                  <div className="w-6 h-6 bg-auth-btn-bg rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 order-1 lg:order-2 flex flex-col h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Book Your Ride
            </h2>

            {/* Alert */}
            {alert && (
              <div className="mb-4">
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4">
              {/* Location Fields */}
              <div className="space-y-2 sm:space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                  <Input
                    type="text"
                    name="from"
                    placeholder="From:"
                    value={formData.from}
                    onChange={handleChange}
                    error={errors.from}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                  <Input
                    type="text"
                    name="to"
                    placeholder="To:"
                    value={formData.to}
                    onChange={handleChange}
                    error={errors.to}
                    className="pl-10 sm:pl-12"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Distance (km):
                  </label>
                  <Input
                    type="number"
                    name="distanceKm"
                    placeholder="e.g. 15"
                    value={formData.distanceKm}
                    onChange={handleChange}
                    error={errors.distanceKm}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date:
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      error={errors.date}
                      className="pl-10 sm:pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time:
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                    <Input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      error={errors.time}
                      className="pl-10 sm:pl-12"
                    />
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passenger Name:
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                    <Input
                      type="text"
                      name="passengerName"
                      placeholder="Name"
                      value={formData.passengerName}
                      onChange={handleChange}
                      error={errors.passengerName}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Number:
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                    <Input
                      type="tel"
                      name="contactNumber"
                      placeholder="+92XXXXXXXXXX or 03XXXXXXXXX"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      error={errors.contactNumber}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Email and Number of Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    No of Passengers:
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg" />
                    <Input
                      type="text"
                      name="numberOfPassengers"
                      placeholder="e.g. (1-7)"
                      value={formData.numberOfPassengers}
                      onChange={handleChange}
                      error={errors.numberOfPassengers}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Special Requirements (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-auth-btn-bg z-10" />
                  <textarea
                    name="specialRequirements"
                    placeholder="Requirements..."
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-auth-btn-bg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-auth-btn-bg/30 transition-all resize-none text-sm"
                  />
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Vehicle:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle.id)}
                      className={`group relative cursor-pointer rounded-lg p-2 border-2 transition-all duration-200 hover:border-auth-btn-bg ${
                        formData.selectedVehicle === vehicle.id
                          ? "border-auth-btn-bg bg-buttons-gradient"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center space-y-1">
                        <div className="relative flex justify-center">
                          <Image
                            src={vehicle.image}
                            alt={vehicle.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                          {/* Seat count badge */}
                          <div className="absolute -top-1 -right-1 bg-auth-btn-bg text-white  dark:text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {vehicle.seats}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <h3
                            className={`font-semibold text-xs ${
                              formData.selectedVehicle === vehicle.id
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {vehicle.name}
                          </h3>
                          <p
                            className={`text-xs ${
                              formData.selectedVehicle === vehicle.id
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {vehicle.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vehicle selection error */}
                {errors.selectedVehicle && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.selectedVehicle}
                  </p>
                )}

                {/* Selected vehicle info */}
                {formData.selectedVehicle && (
                  <div className="mt-3 p-2 bg-auth-btn-bg/5 border border-auth-btn-bg/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-auth-btn-bg rounded-full flex-shrink-0"></div>
                      <span className="text-xs font-medium text-auth-btn-bg dark:text-gray-300">
                        {
                          vehicles.find(
                            (v) => v.id === formData.selectedVehicle
                          )?.name
                        }{" "}
                        -
                        {
                          vehicles.find(
                            (v) => v.id === formData.selectedVehicle
                          )?.capacity
                        }{" "}
                        -
                        {
                          vehicles.find(
                            (v) => v.id === formData.selectedVehicle
                          )?.price
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Ride Button - Fixed at bottom */}
            <div className="pt-3 sm:pt-4 mt-auto">
              <Button
                onClick={handleBookRide}
                disabled={submitting}
                className="w-full bg-buttons-gradient hover:bg-buttons-gradient-hover text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Submitting...
                  </span>
                ) : (
                  "Book Ride"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
