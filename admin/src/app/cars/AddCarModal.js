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
  Briefcase,
  FileText,
} from "lucide-react";
import { showToast } from "../lib/toast";

const VEHICLE_CATEGORIES = [
  { value: "economy", label: "Economy" },
  { value: "standard", label: "Standard" },
  { value: "first_class", label: "First Class" },
  { value: "standard_van", label: "Standard Van" },
  { value: "first_class_van", label: "First Class Van" },
  { value: "minibus", label: "Minibus" },
];

export default function AddCarModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    category: "",
    registrationNumber: "",
    model: "",
    year: "",
    farePerKm: "",
    capacity: "",
    luggage_capacity: "",
    description: "",
    availability: "Available",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !formData.category.trim() ||
      !formData.registrationNumber.trim() ||
      !formData.model.trim() ||
      !formData.year ||
      !formData.farePerKm ||
      !formData.capacity
    ) {
      showToast.error("Please fill in all required fields");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(formData);
      handleDiscard();
    } catch (error) {
      showToast.error("Failed to add vehicle. Please try again.");
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
      luggage_capacity: "",
      description: "",
      availability: "Available",
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all";

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
                className={inputCls}
              >
                <option value="">Select category</option>
                {VEHICLE_CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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
                className={inputCls}
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
                className={inputCls}
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
                className={inputCls}
              >
                <option value="">Select year</option>
                {Array.from({ length: 20 }, (_, i) => 2026 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fare & Capacity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Fare Per Km (SAR) *</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 2.50"
                value={formData.farePerKm}
                onChange={(e) => handleInputChange("farePerKm", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4" />
                <span>Passenger Capacity *</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 4"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                className={inputCls}
                min="1"
                max="20"
              />
            </div>
          </div>

          {/* Luggage & Description Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Luggage Capacity</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 3"
                value={formData.luggage_capacity}
                onChange={(e) =>
                  handleInputChange("luggage_capacity", e.target.value)
                }
                className={inputCls}
                min="0"
                max="30"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Toyota Camry, Honda Accord or similar"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={inputCls}
              />
            </div>
          </div>

          {/* Assigned To */}
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
