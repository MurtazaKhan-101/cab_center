"use client";

import { useState } from "react";
import { Button } from "../components/ui";
import { X } from 'lucide-react';
import { showToast } from '../lib/toast';

export default function AddDriverModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    licenseNumber: "",
    assignedVehicle: "",
    availability: "Available"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate form data before saving
    if (!formData.name.trim() || !formData.contact.trim() || !formData.licenseNumber.trim()) {
      showToast.error("Please fill in all required fields");
      return;
    }

    // Show loading toast
    const toastId = showToast.loading("Adding driver...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      showToast.success("Driver added successfully!", toastId);
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
      assignedVehicle: "",
      availability: "Available"
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex bg-secondary items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-white dark:text-gray-100">Add Driver</h2>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>
            
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
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              </div>
            </div>

            {/* License Number and Assigned Vehicle Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter license number"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Vehicle</label>
                <select
                  value={formData.assignedVehicle}
                  onChange={(e) => handleInputChange('assignedVehicle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                >
                  <option value="">Assign a vehicle</option>
                  <option value="Hyundai Sitaria">Hyundai Sitaria</option>
                  <option value="Toyota Camry">Toyota Camry</option>
                  <option value="Honda Accord">Honda Accord</option>
                  <option value="Nissan Altima">Nissan Altima</option>
                  <option value="BMW 3 Series">BMW 3 Series</option>
                  <option value="Mercedes C-Class">Mercedes C-Class</option>
                </select>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Availability</label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
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