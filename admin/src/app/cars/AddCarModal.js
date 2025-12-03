"use client";

import { useState } from "react";
import { Button } from "../components/ui";
import {
  X,
  Car,
  CreditCard,
  Calendar,
  Users,
  Settings,
  DollarSign,
} from "lucide-react";
import { showToast } from "../lib/toast";

export default function AddCarModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    category: "",
    registrationNumber: "",
    model: "",
    year: "",
    farePerKm: "",
    capacity: "",
    availability: "Available",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Validate form data before saving
    if (
      !formData.category.trim() ||
      !formData.registrationNumber.trim() ||
      !formData.model.trim() ||
      !formData.year ||
      !formData.farePerKm.trim() ||
      !formData.capacity.trim()
    ) {
      showToast.error("Please fill in all required fields");
      return;
    }

    // Show loading toast
    const toastId = showToast.loading("Adding vehicle...");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSave(formData);
      showToast.success("Vehicle added successfully!", toastId);
      handleDiscard();
    } catch (error) {
      showToast.error("Failed to add vehicle. Please try again.", toastId);
    }
  };

  const handleDiscard = () => {
    setFormData({
      category: "",
      registrationNumber: "",
      model: "",
      year: "",
      farePerKm: "",
      capacity: "",
      availability: "Available",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-secondary p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Car className="w-5 h-5" />
            <span>Add New Vehicle</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Category and Registration Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Settings className="w-4 h-4" />
                <span>Category *</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              >
                <option value="">Select category</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Mini Van">Mini Van</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CreditCard className="w-4 h-4" />
                <span>Registration Number *</span>
              </label>
              <input
                type="text"
                placeholder="e.g., KSA 2370"
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>
          </div>

          {/* Model and Year Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Car className="w-4 h-4" />
                <span>Model *</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Camry, Prado, Hiace"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Year *</span>
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              >
                <option value="">Select year</option>
                {Array.from({ length: 20 }, (_, i) => 2025 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Fare Per Km *</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 2.50"
                value={formData.farePerKm}
                onChange={(e) => handleInputChange("farePerKm", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4" />
                <span>Capacity *</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 4"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                min="1"
                max="20"
              />
            </div>
          </div>

          {/* Assigned To and Availability Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4" />
                <span>Assigned To</span>
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                {formData.assignedTo ||
                  "Not assigned - Manage from Driver Management"}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Vehicle assignments are managed from Driver Management section
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Settings className="w-4 h-4" />
                <span>Availability</span>
              </label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={handleDiscard}
            variant="outline"
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-buttons-gradient hover:bg-buttons-gradient-hover text-white px-6 py-2"
          >
            Add Vehicle
          </Button>
        </div>
      </div>
    </div>
  );
}
