"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, User, Phone, Mail, Users, MessageSquare } from "lucide-react";
import { Button, Input, Alert } from "../ui";
import Image from "next/image";

export default function BookingInterface() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengerName: "",
    contactNumber: "",
    email: "",
    numberOfPassengers: "",
    specialRequirements: "",
    selectedVehicle: null
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const vehicles = [
    {
      id: "sedan",
      name: "Sedan",
      price: "SAR 110",
      image: "/images/sedan.svg",
      seats: 4,
      capacity: "4 seats"
    },
    {
      id: "suv",
      name: "SUV", 
      price: "SAR 170",
      image: "/images/suv.svg",
      seats: 6,
      capacity: "6 seats"
    },
    {
      id: "mini-van",
      name: "Mini Van",
      price: "SAR 220", 
      image: "/images/hiace.svg",
      seats: 14,
      capacity: "14 seats"
    },
  
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear alert when user makes changes
    if (alert) {
      setAlert(null);
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedVehicle: prev.selectedVehicle === vehicleId ? null : vehicleId 
    }));
    // Clear vehicle selection error
    if (errors.selectedVehicle) {
      setErrors(prev => ({ ...prev, selectedVehicle: "" }));
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
    } else if (!/^\+966[0-9]{9}$/.test(formData.contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = "Please enter a valid Saudi mobile number (+966XXXXXXXXX)";
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
      } else if (passengerCount > 14) {
        newErrors.numberOfPassengers = "Maximum 14 passengers allowed";
      } else if (formData.selectedVehicle) {
        const selectedVehicle = vehicles.find(v => v.id === formData.selectedVehicle);
        if (selectedVehicle && passengerCount > selectedVehicle.seats) {
          newErrors.numberOfPassengers = `Selected vehicle can only accommodate ${selectedVehicle.seats} passengers`;
        }
      }
    }

    // Vehicle selection validation
    if (!formData.selectedVehicle) {
      newErrors.selectedVehicle = "Please select a vehicle";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookRide = () => {
    setAlert(null);
    
    if (!validateForm()) {
      setAlert({
        type: "error",
        message: "Please correct the errors below and try again."
      });
      return;
    }

    // If validation passes, proceed with booking
    setAlert({
      type: "success",
      message: "Booking request submitted successfully! You will receive a confirmation shortly."
    });
    
    console.log("Booking data:", formData);
    // Handle booking submission here
    // TODO: Implement actual booking API call
  };

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
                      placeholder="+966XXXXXXXXX"
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
                          <h3 className={`font-semibold text-xs ${
                            formData.selectedVehicle === vehicle.id 
                              ? "text-white" 
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {vehicle.name}
                          </h3>
                          <p className={`text-xs ${
                            formData.selectedVehicle === vehicle.id 
                              ? "text-white" 
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {vehicle.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Vehicle selection error */}
                {errors.selectedVehicle && (
                  <p className="mt-1 text-sm text-red-500">{errors.selectedVehicle}</p>
                )}
                
                {/* Selected vehicle info */}
                {formData.selectedVehicle && (
                  <div className="mt-3 p-2 bg-auth-btn-bg/5 border border-auth-btn-bg/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-auth-btn-bg rounded-full flex-shrink-0"></div>
                      <span className="text-xs font-medium text-auth-btn-bg dark:text-gray-300">
                        {vehicles.find(v => v.id === formData.selectedVehicle)?.name} - 
                        {vehicles.find(v => v.id === formData.selectedVehicle)?.capacity} - 
                        {vehicles.find(v => v.id === formData.selectedVehicle)?.price}
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
                className="w-full bg-buttons-gradient hover:bg-buttons-gradient-hover text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Book Ride
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}