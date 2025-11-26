"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui";
import { X } from "lucide-react";
import { showToast } from "../lib/toast";
import * as vehicleService from "../lib/vehicle";

export default function AddDriverModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    licenseNumber: "",
    monthlySalary: "",
    vehicleCategory: "",
    assignedVehicleId: "",
    availability: "Available",
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // Fetch vehicle types when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchVehicleTypesAndVehicles();
    }
  }, [isOpen]);

  // Filter vehicles when category changes
  useEffect(() => {
    if (formData.vehicleCategory) {
      const filtered = availableVehicles.filter(
        (v) => v.vehicle_type === formData.vehicleCategory.toLowerCase()
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles([]);
    }
  }, [formData.vehicleCategory, availableVehicles]);

  const fetchVehicleTypesAndVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const [typesRes, vehiclesRes] = await Promise.all([
        vehicleService.getVehicleTypes(),
        vehicleService.getAllVehicles(),
      ]);

      if (typesRes.success) {
        // Extract vehicle type names from the response
        // If vehicleTypes is an array of objects with 'type' property, extract them
        // If it's already an array of strings, use as is
        const types = typesRes.vehicleTypes.map((item) =>
          typeof item === "string"
            ? item
            : item.type || item.vehicle_type || item._id
        );
        setVehicleTypes(types);
      }

      if (vehiclesRes.success) {
        // Filter for vehicles that are available and not assigned to any driver
        const unassignedVehicles = vehiclesRes.vehicles.filter(
          (v) => v.availability_status === "available" && !v.assigned_driver_id
        );
        setAvailableVehicles(unassignedVehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      showToast.error("Failed to load vehicles");
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Reset vehicle selection when category changes
      if (field === "vehicleCategory") {
        updated.assignedVehicleId = "";
      }

      return updated;
    });
  };

  const handleSave = async () => {
    // Validate form data before saving
    if (
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.licenseNumber.trim() ||
      !formData.monthlySalary
    ) {
      showToast.error("Please fill in all required fields");
      return;
    }

    // Show loading toast
    const toastId = showToast.loading("Adding driver...");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSave(formData);
      handleDiscard();
    } catch (error) {
      showToast.error("Failed to add driver. Please try again.", toastId);
    }
  };

  const handleDiscard = () => {
    setFormData({
      name: "",
      contact: "",
      licenseNumber: "",
      monthlySalary: "",
      vehicleCategory: "",
      assignedVehicleId: "",
      availability: "Available",
    });
    setFilteredVehicles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex bg-secondary items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-white dark:text-gray-100">
            Add Driver
          </h2>
          <button
            onClick={handleDiscard}
            className="p-2 text-white hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Personal Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Personal Information
            </h3>

            {/* Name and Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              </div>
            </div>

            {/* License Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter license number"
                value={formData.licenseNumber}
                onChange={(e) =>
                  handleInputChange("licenseNumber", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            {/* Monthly Salary */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Salary (SAR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter monthly salary"
                value={formData.monthlySalary}
                onChange={(e) =>
                  handleInputChange("monthlySalary", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            {/* Vehicle Assignment Section */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Vehicle Assignment (Optional)
              </h4>

              {/* Vehicle Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Category
                </label>
                <select
                  value={formData.vehicleCategory}
                  onChange={(e) =>
                    handleInputChange("vehicleCategory", e.target.value)
                  }
                  disabled={loadingVehicles}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select vehicle category</option>
                  {vehicleTypes.map((type) => {
                    const typeStr = String(type);
                    return (
                      <option key={typeStr} value={typeStr}>
                        {typeStr.charAt(0).toUpperCase() + typeStr.slice(1)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Vehicle Selection (Only shown when category is selected) */}
              {formData.vehicleCategory && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Vehicle
                  </label>
                  <select
                    value={formData.assignedVehicleId}
                    onChange={(e) =>
                      handleInputChange("assignedVehicleId", e.target.value)
                    }
                    disabled={loadingVehicles || filteredVehicles.length === 0}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {filteredVehicles.length === 0
                        ? `No available ${formData.vehicleCategory} vehicles`
                        : "Select a vehicle"}
                    </option>
                    {filteredVehicles.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.model} - {vehicle.registration_number}
                      </option>
                    ))}
                  </select>
                  {filteredVehicles.length === 0 &&
                    formData.vehicleCategory && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        No available vehicles in this category
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-6 border-t border-gray-200 dark:border-gray-600">
          <Button
            onClick={handleDiscard}
            variant="outline"
            className="w-full sm:w-auto px-6 py-3 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            Discard
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            className="w-full sm:w-auto px-6 py-3 bg-ui-cards-gradient text-white hover:bg-buttons-gradient-hover transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
