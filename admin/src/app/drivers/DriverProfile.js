"use client";

import { useState } from "react";
import { Button } from "../components/ui";
import { ArrowLeft, Edit, Trash2, User, Calendar, Clock, Car, Phone, CreditCard } from 'lucide-react';
import { showToast } from '../lib/toast';

export default function DriverProfile({ driver, onBack, onEdit, onDelete, onSave, initialEditMode = false }) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editFormData, setEditFormData] = useState({
    name: driver?.name || "",
    contact: driver?.contact || "",
    licenseNumber: driver?.licenseNumber || "",
    assignedVehicle: driver?.assignedVehicle || "",
    availability: driver?.availability || "Available"
  });

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!editFormData.name.trim() || !editFormData.contact.trim() || !editFormData.licenseNumber.trim()) {
      showToast.error("Please fill in all required fields");
      return;
    }

    const toastId = showToast.loading("Updating driver...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave({ ...driver, ...editFormData });
      showToast.success("Driver updated successfully!", toastId);
      setIsEditing(false);
    } catch (error) {
      showToast.error("Failed to update driver. Please try again.", toastId);
    }
  };

  const handleCancel = () => {
    setEditFormData({
      name: driver?.name || "",
      contact: driver?.contact || "",
      licenseNumber: driver?.licenseNumber || "",
      assignedVehicle: driver?.assignedVehicle || "",
      availability: driver?.availability || "Available"
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${driver.name}? This action cannot be undone.`);
    
    if (!confirmDelete) return;
    
    const toastId = showToast.loading("Deleting driver...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onDelete(driver.id);
      showToast.success("Driver deleted successfully!", toastId);
    } catch (error) {
      showToast.error("Failed to delete driver. Please try again.", toastId);
    }
  };

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Driver Not Found</h2>
          <Button onClick={onBack} variant="primary">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              className="p-2 w-12 h-12 flex items-center justify-center bg-buttons-gradient"
            >
              <ArrowLeft className="w-8 h-8 text-white" />
            </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Driver Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage driver information</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Total Rides Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg bg-ui-cards-gradient text-white transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 dark:bg-blue-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
              <Car className="w-6 h-6 text-white dark:text-blue-400 group-hover:text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-white dark:text-gray-400 group-hover:text-white/80 uppercase tracking-wider">Total Rides</p>
              <p className="text-2xl font-bold text-white dark:text-gray-100 group-hover:text-white">45</p>
            </div>
          </div>
        </div>

        {/* Monthly Present Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 uppercase tracking-wider">Monthly Present</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">27<span className="text-sm font-normal">/30</span></p>
            </div>
          </div>
        </div>

        {/* Average Ride Time Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 uppercase tracking-wider">Average Ride Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">1hr 23min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-secondary px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4" />
                <span>Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {driver.name}
                </div>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {driver.contact}
                </div>
              )}
            </div>

            {/* License Number */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CreditCard className="w-4 h-4" />
                <span>License Number</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {driver.licenseNumber}
                </div>
              )}
            </div>

            {/* Assigned Vehicle */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Car className="w-4 h-4" />
                <span>Assigned Vehicle</span>
              </label>
              {isEditing ? (
                <select
                  value={editFormData.assignedVehicle}
                  onChange={(e) => handleInputChange('assignedVehicle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                >
                  <option value="">Select a vehicle</option>
                  <option value="Hiace">Hiace</option>
                  <option value="Hyundai Sitaria">Hyundai Sitaria</option>
                  <option value="Toyota Camry">Toyota Camry</option>
                  <option value="Honda Accord">Honda Accord</option>
                  <option value="Nissan Altima">Nissan Altima</option>
                  <option value="BMW 3 Series">BMW 3 Series</option>
                  <option value="Mercedes C-Class">Mercedes C-Class</option>
                </select>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {driver.assignedVehicle || "Not assigned"}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Availability</span>
              </label>
              {isEditing ? (
                <select
                  value={editFormData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    driver.availability === 'Available' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      driver.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {driver.availability}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Below personal info for all screen sizes */}
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {!isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Driver</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Driver</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  variant="primary"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6 bg-ui-cards-gradient"
                >
                  <span>Save Changes</span>
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6"
                >
                  <span>Cancel</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}