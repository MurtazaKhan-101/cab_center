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
import { calculateFare } from "../../lib/booking";
import { getVehicleTypes } from "../../lib/vehicle";
import { useTranslation } from "../../../lib/i18n";
import CheckoutScreen from "./CheckoutScreen";

export default function BookingInterface() {
  const { user } = useAuth();
  const { t, isRTL } = useTranslation();

  const [currentStep, setCurrentStep] = useState("booking"); // 'booking' or 'checkout'
  const [checkoutData, setCheckoutData] = useState(null);

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
          name: t("vehicles.sedan"),
          price: t("booking_form.price_per_km", { price: "50" }),
          farePerKm: 50,
          image: "/images/sedan.svg",
          seats: 4,
          capacity: t("booking_form.vehicle_capacity", { seats: "4" }),
        },
        {
          id: "suv",
          name: t("vehicles.suv"),
          price: t("booking_form.price_per_km", { price: "80" }),
          farePerKm: 80,
          image: "/images/suv.svg",
          seats: 6,
          capacity: t("booking_form.vehicle_capacity", { seats: "6" }),
        },
        {
          id: "mini van",
          name: t("vehicles.mini van"),
          price: t("booking_form.price_per_km", { price: "150" }),
          farePerKm: 150,
          image: "/images/mini van.svg",
          seats: 4,
          capacity: t("booking_form.vehicle_capacity", { seats: "4" }),
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
              t(`vehicles.${v.vehicle_type}`) ||
              v.vehicle_type.charAt(0).toUpperCase() + v.vehicle_type.slice(1),
            price: t("booking_form.price_per_km", { price: v.fare_per_km }),
            farePerKm: v.fare_per_km,
            image: `/images/${v.vehicle_type}.svg`,
            seats: v.capacity,
            capacity: t("booking_form.vehicle_capacity", { seats: v.capacity }),
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
  }, [t]);

  // Update email when user changes
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Apply character limits
    let updatedValue = value;
    if (name === "passengerName" && value.length > 100) {
      updatedValue = value.substring(0, 100);
    }
    if (name === "specialRequirements" && value.length > 500) {
      updatedValue = value.substring(0, 500);
    }
    if (name === "from" && value.length > 100) {
      updatedValue = value.substring(0, 100);
    }
    if (name === "to" && value.length > 100) {
      updatedValue = value.substring(0, 100);
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
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
      newErrors.from = t("validation.pickup_required");
    } else if (formData.from.trim().length < 3) {
      newErrors.from = t("validation.pickup_min_length");
    } else if (formData.from.trim().length > 100) {
      newErrors.from = t("validation.pickup_max_length");
    }

    if (!formData.to.trim()) {
      newErrors.to = t("validation.destination_required");
    } else if (formData.to.trim().length < 3) {
      newErrors.to = t("validation.destination_min_length");
    } else if (formData.to.trim().length > 100) {
      newErrors.to = t("validation.destination_max_length");
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = t("validation.date_required");
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = t("validation.date_past_error");
      }
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = t("validation.time_required");
    } else if (formData.date) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        newErrors.time = t("validation.time_future_error");
      }
    }

    // Passenger details validation
    if (!formData.passengerName.trim()) {
      newErrors.passengerName = t("validation.passenger_name_required");
    } else if (formData.passengerName.trim().length < 2) {
      newErrors.passengerName = t("validation.passenger_name_min");
    } else if (formData.passengerName.trim().length > 100) {
      newErrors.passengerName = t("validation.passenger_name_max");
    } else if (
      !/^[a-zA-Z\s\u0600-\u06FF]+$/.test(formData.passengerName.trim())
    ) {
      newErrors.passengerName = t("validation.passenger_name_letters");
    }

    // Contact number validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = t("validation.contact_required");
    } else if (
      !/^(\+966|05)[0-9]{8}$/.test(formData.contactNumber.replace(/\s/g, ""))
    ) {
      newErrors.contactNumber = t("validation.contact_invalid_sa");
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("validation.email_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("validation.email_invalid");
    }

    // Number of passengers validation
    if (!formData.numberOfPassengers.trim()) {
      newErrors.numberOfPassengers = t("validation.passengers_count_required");
    } else {
      const passengerCount = parseInt(formData.numberOfPassengers);
      if (isNaN(passengerCount) || passengerCount < 1) {
        newErrors.numberOfPassengers = t("validation.passengers_min");
      } else if (passengerCount > 20) {
        newErrors.numberOfPassengers = t("validation.passengers_max");
      } else if (formData.selectedVehicle) {
        const selectedVehicle = vehicles.find(
          (v) => v.id === formData.selectedVehicle
        );
        if (selectedVehicle && passengerCount > selectedVehicle.seats) {
          newErrors.numberOfPassengers = t(
            "validation.vehicle_capacity_error",
            {
              seats: selectedVehicle.seats,
            }
          );
        }
      }
    }

    // Distance validation
    if (!formData.distanceKm.trim()) {
      newErrors.distanceKm = t("validation.distance_required");
    } else {
      const distance = parseFloat(formData.distanceKm);
      if (isNaN(distance) || distance <= 0) {
        newErrors.distanceKm = t("validation.distance_positive");
      } else if (distance > 1000) {
        newErrors.distanceKm = t("validation.distance_max");
      }
    }

    // Special requirements validation
    if (
      formData.specialRequirements &&
      formData.specialRequirements.length > 500
    ) {
      newErrors.specialRequirements = t("validation.req_max_length");
    }

    // Vehicle selection validation
    if (!formData.selectedVehicle) {
      newErrors.selectedVehicle = t("validation.vehicle_select_error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookRide = async () => {
    setAlert(null);

    if (!validateForm()) {
      setAlert({
        type: "error",
        message: t("messages.correct_errors"),
      });
      return;
    }

    setSubmitting(true);

    try {
      // Prepare fare calculation data
      const fareData = {
        vehicle_type: formData.selectedVehicle,
        distance_km: parseFloat(formData.distanceKm),
        pickup_location: formData.from.trim(),
        booking_date: formData.date,
        booking_time: formData.time,
      };

      // Calculate fare first
      const fareResponse = await calculateFare(fareData);

      if (fareResponse.success) {
        // Prepare booking data for checkout
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

        // Get vehicle info for checkout
        const vehicleInfo = vehicles.find(
          (v) => v.id === formData.selectedVehicle
        );

        // Set checkout data and navigate to checkout
        setCheckoutData({
          bookingData,
          vehicleInfo,
          calculatedFare: fareResponse.fare,
        });
        setCurrentStep("checkout");
      } else {
        setAlert({
          type: "error",
          message:
            fareResponse.message || t("messages.fare_calculation_failed"),
        });
      }
    } catch (error) {
      console.error("Fare calculation error:", error);
      setAlert({
        type: "error",
        message: error.message || t("messages.fare_calculation_failed"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToBooking = () => {
    setCurrentStep("booking");
    setCheckoutData(null);
  };

  const handleBookingSuccess = (response) => {
    setAlert({
      type: "success",
      message: t("messages.booking_success", {
        fare: response.booking.total_fare,
      }),
    });

    // Reset form and go back to booking
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
    setCurrentStep("booking");
    setCheckoutData(null);
  };

  // Show checkout screen if we're in checkout step
  if (currentStep === "checkout" && checkoutData) {
    return (
      <CheckoutScreen
        bookingData={checkoutData.bookingData}
        vehicleInfo={checkoutData.vehicleInfo}
        calculatedFare={checkoutData.calculatedFare}
        onBack={handleBackToBooking}
        onBookingSuccess={handleBookingSuccess}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 ${
        isRTL() ? "rtl" : "ltr"
      }`}
    >
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
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 order-1 lg:order-2 flex flex-col h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t("booking_form.title")}
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
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.from_label")}
                  </label>
                  <div className="relative">
                    <MapPin
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-4 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="text"
                      name="from"
                      placeholder={t("booking_form.from_placeholder")}
                      value={formData.from}
                      onChange={handleChange}
                      error={errors.from}
                      className={isRTL() ? "pr-10" : "pl-10"}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.to_label")}
                  </label>
                  <div className="relative">
                    <MapPin
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-4 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="text"
                      name="to"
                      placeholder={t("booking_form.to_placeholder")}
                      value={formData.to}
                      onChange={handleChange}
                      error={errors.to}
                      className={isRTL() ? "pr-10 sm:pr-12" : "pl-10 sm:pl-12"}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.distance_label")}
                  </label>
                  <Input
                    type="number"
                    name="distanceKm"
                    placeholder={t("booking_form.distance_placeholder")}
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
                    {t("booking_form.date_label")}
                  </label>
                  <div className="relative">
                    <Calendar
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      error={errors.date}
                      className={isRTL() ? "pr-10 sm:pr-12" : "pl-10 sm:pl-12"}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.time_label")}
                  </label>
                  <div className="relative">
                    <Clock
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      error={errors.time}
                      className={isRTL() ? "pr-10 sm:pr-12" : "pl-10 sm:pl-12"}
                    />
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.passenger_name_label")}
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="text"
                      name="passengerName"
                      placeholder={t("booking_form.passenger_name_placeholder")}
                      value={formData.passengerName}
                      onChange={handleChange}
                      error={errors.passengerName}
                      className={isRTL() ? "pr-10" : "pl-10"}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.contact_number_label")}
                  </label>
                  <div className="relative">
                    <Phone
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="tel"
                      name="contactNumber"
                      placeholder={t("booking_form.contact_placeholder")}
                      value={formData.contactNumber}
                      onChange={handleChange}
                      error={errors.contactNumber}
                      className={isRTL() ? "pr-10" : "pl-10"}
                    />
                  </div>
                </div>
              </div>

              {/* Email and Number of Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.email_label")}
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="email"
                      name="email"
                      placeholder={t("booking_form.email_placeholder")}
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      className={isRTL() ? "pr-10" : "pl-10"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("booking_form.passengers_label")}
                  </label>
                  <div className="relative">
                    <Users
                      className={`absolute ${
                        isRTL() ? "right-3" : "left-3"
                      } top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-primary`}
                    />
                    <Input
                      type="text"
                      name="numberOfPassengers"
                      placeholder={t("booking_form.passengers_placeholder")}
                      value={formData.numberOfPassengers}
                      onChange={handleChange}
                      error={errors.numberOfPassengers}
                      className={isRTL() ? "pr-10" : "pl-10"}
                    />
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("booking_form.special_req_label")}{" "}
                  <span className="text-xs text-gray-500">
                    ({formData.specialRequirements.length}/500)
                  </span>
                </label>
                <div className="relative">
                  <MessageSquare
                    className={`absolute ${
                      isRTL() ? "right-3" : "left-3"
                    } top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-primary z-10`}
                  />
                  <textarea
                    name="specialRequirements"
                    placeholder={t("booking_form.special_req_placeholder")}
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    rows={2}
                    maxLength={500}
                    className={`w-full px-4 py-3 ${
                      isRTL() ? "pr-10" : "pl-10"
                    } rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-none text-sm`}
                  />
                  {errors.specialRequirements && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.specialRequirements}
                    </p>
                  )}
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t("booking_form.choose_vehicle")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle.id)}
                      className={`group relative cursor-pointer rounded-lg p-2 border-2 transition-all duration-200 hover:border-primary ${
                        formData.selectedVehicle === vehicle.id
                          ? "border-primary bg-buttons-gradient"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-center space-y-1">
                        <div className="relative flex justify-center">
                          {/* <Image
                            src={vehicle.image}
                            alt={vehicle.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          /> */}
                          {/* Seat count badge */}
                          <div className="absolute -top-1 -right-1 bg-primary text-white dark:text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
                  <div className="mt-3 p-2 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-xs font-medium text-primary dark:text-gray-300">
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
                    {t("booking_form.calculating")}
                  </span>
                ) : (
                  t("booking_form.proceed_to_checkout")
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
