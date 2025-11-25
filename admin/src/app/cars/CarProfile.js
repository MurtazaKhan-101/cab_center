"use client";

import { useState } from "react";
import { Button } from "../components/ui";
import { ArrowLeft, Edit, Trash2, Car, Calendar, Settings, Users, CreditCard, MapPin, Fuel, Wrench } from 'lucide-react';
import { showToast } from '../lib/toast';

export default function CarProfile({ car, onBack, onEdit, onDelete, onSave, initialEditMode = false }) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editFormData, setEditFormData] = useState({
    category: car?.category || "",
    registrationNumber: car?.registrationNumber || "",
    model: car?.model || "",
    year: car?.year || "",
    availability: car?.availability || "Available"
  });

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!editFormData.category.trim() || !editFormData.registrationNumber.trim() || !editFormData.model.trim() || !editFormData.year) {
      showToast.error("Please fill in all required fields");
      return;
    }

    const toastId = showToast.loading("Updating vehicle...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Preserve the original assignedTo value since it's managed from driver side
      onSave({ ...car, ...editFormData, assignedTo: car.assignedTo });
      showToast.success("Vehicle updated successfully!", toastId);
      setIsEditing(false);
    } catch (error) {
      showToast.error("Failed to update vehicle. Please try again.", toastId);
    }
  };

  const handleCancel = () => {
    setEditFormData({
      category: car?.category || "",
      registrationNumber: car?.registrationNumber || "",
      model: car?.model || "",
      year: car?.year || "",
      availability: car?.availability || "Available"
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${car.model} (${car.registrationNumber})? This action cannot be undone.`);
    
    if (!confirmDelete) return;
    
    const toastId = showToast.loading("Deleting vehicle...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onDelete(car.id);
      showToast.success("Vehicle deleted successfully!", toastId);
    } catch (error) {
      showToast.error("Failed to delete vehicle. Please try again.", toastId);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center p-4">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The vehicle you are looking for doesnot exist.</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Vehicle Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage vehicle information</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Total Trips Card */}
        <div className="bg-ui-cards-gradient dark:bg-gray-800 rounded-xl p-6 shadow-lg  hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 dark:bg-blue-900 rounded-lg flex items-center justify-center transition-colors">
              <MapPin className="w-6 h-6 text-white dark:text-blue-400 group-hover:text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-white dark:text-gray-400 group-hover:text-white/80 uppercase tracking-wider">Total Trips</p>
              <p className="text-2xl font-bold text-white dark:text-gray-100 group-hover:text-white">152</p>
            </div>
          </div>
        </div>

        {/* Monthly Distance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
              <Car className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 uppercase tracking-wider">Monthly Distance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">2,340<span className="text-sm font-normal">km</span></p>
            </div>
          </div>
        </div>

        {/* Fuel Efficiency Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
              <Fuel className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 uppercase tracking-wider">Fuel Efficiency</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">12.5<span className="text-sm font-normal">L/100km</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-secondary px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Car className="w-5 h-5" />
            <span>Vehicle Information</span>
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Settings className="w-4 h-4" />
                <span>Category</span>
              </label>
              {isEditing ? (
                <select
                  value={editFormData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                >
                  <option value="">Select category</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Mini Van">Mini Van</option>
                </select>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {car.category}
                </div>
              )}
            </div>

            {/* Registration Number */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CreditCard className="w-4 h-4" />
                <span>Registration Number</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {car.registrationNumber}
                </div>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Car className="w-4 h-4" />
                <span>Model</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {car.model}
                </div>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Year</span>
              </label>
              {isEditing ? (
                <select
                  value={editFormData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 20 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                  {car.year}
                </div>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4" />
                <span>Assigned To</span>
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
                {car.assignedTo || "Not assigned"}
              </div>
              {isEditing && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Vehicle assignments are managed from Driver Management section
                </p>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Settings className="w-4 h-4" />
                <span>Availability</span>
              </label>
              {isEditing ? (
                <select
                  value={editFormData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    car.availability === 'Available' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      car.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {car.availability}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Below vehicle info for all screen sizes */}
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
                  <span>Edit Vehicle</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Vehicle</span>
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