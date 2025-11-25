"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Spinner } from "../components/ui";
import { ROUTES } from "../lib/constants";
import MainLayout from "../components/layout/MainLayout";
import AddDriverModal from "./AddDriverModal";
import DriverProfile from "./DriverProfile";
import { showToast } from "../lib/toast";
import { Edit, Eye, Trash2, Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DriversPage() {
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(7);
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'profile'
  const [isEditMode, setIsEditMode] = useState(false);
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-01-15",
      rating: 4.8
    },
    {
      id: 2,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-01-20",
      rating: 4.6
    },
    {
      id: 3,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-02-01",
      rating: 4.9
    },
    {
      id: 4,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-02-10",
      rating: 4.7
    },
    {
      id: 5,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-02-15",
      rating: 4.5
    },
    {
      id: 6,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-02-20",
      rating: 4.8
    },
    {
      id: 7,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-02-25",
      rating: 4.6
    },
    {
      id: 8,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Not Available",
      joinDate: "2024-03-01",
      rating: 4.9
    },
    {
      id: 9,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Not Available",
      joinDate: "2024-03-05",
      rating: 4.4
    },
    {
      id: 10,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-03-10",
      rating: 4.7
    },
    {
      id: 11,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-03-15",
      rating: 4.8
    },
    {
      id: 12,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-03-20",
      rating: 4.5
    },
    {
      id: 13,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-03-25",
      rating: 4.9
    },
    {
      id: 14,
      name: "Ahmed",
      licenseNumber: "KSA 2370",
      contact: "+9665151212",
      assignedVehicle: "Hyundai Sitaria",
      availability: "Available",
      joinDate: "2024-03-30",
      rating: 4.6
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, loading, isAuthenticated, router]);

  // Filter drivers based on search term and status
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.contact.includes(searchTerm) ||
      driver.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || driver.availability === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Add Driver Modal Handlers
  const handleAddDriver = (newDriverData) => {
    // In real app, this would make an API call
    const newDriver = {
      id: drivers.length + 1,
      ...newDriverData,
      joinDate: new Date().toISOString().split('T')[0],
      rating: 0
    };
    setDrivers(prev => [...prev, newDriver]);
    showToast.success(`Driver "${newDriverData.name}" has been added successfully!`);
    console.log('Driver added:', newDriver);
  };

  const handleCloseModal = () => {
    setShowAddDriverModal(false);
  };

  // Driver Profile Handlers
  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setViewMode('profile');
    setIsEditMode(false);
  };

  const handleEditDriverProfile = (driver) => {
    setSelectedDriver(driver);
    setViewMode('profile');
    setIsEditMode(true);
  };

  const handleBackToList = () => {
    setSelectedDriver(null);
    setViewMode('list');
    setIsEditMode(false);
  };

  const handleEditDriver = (updatedDriver) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    ));
    showToast.success(`Driver "${updatedDriver.name}" has been updated successfully!`);
    console.log('Driver updated:', updatedDriver);
  };

  const handleDeleteDriver = (driverId) => {
    const driverToDelete = drivers.find(driver => driver.id === driverId);
    
    // Show loading toast
    const loadingToast = showToast.loading('Deleting driver...');
    
    // Simulate API call delay
    setTimeout(() => {
      setDrivers(prev => prev.filter(driver => driver.id !== driverId));
      setViewMode('list');
      setSelectedDriver(null);
      
      // Dismiss loading toast and show success
      showToast.dismiss(loadingToast);
      showToast.success(`Driver "${driverToDelete?.name || 'Unknown'}" has been deleted successfully!`);
      
      console.log('Driver deleted:', driverId);
    }, 1000);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Not Available":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Render Driver Profile if in profile view mode
  if (viewMode === 'profile' && selectedDriver) {
    return (
      <MainLayout>
        <DriverProfile
          driver={selectedDriver}
          onBack={handleBackToList}
          onEdit={handleEditDriver}
          onDelete={handleDeleteDriver}
          onSave={handleEditDriver}
          initialEditMode={isEditMode}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Driver Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor your drivers</p>
          </div>
          <Button
            onClick={() => setShowAddDriverModal(true)}
            className="bg-ui-cards-gradient text-white hover:bg-buttons-gradient-hover flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="w-5 h-5" />
            <span>Add Driver</span>
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center space-x-2 px-4 py-3 rounded-lg transition-all"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setStatusFilter("");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === "" ? "bg-secondary text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      All Status
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("Available");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === "Available" ? "bg-secondary text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("Not Available");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === "Not Available" ? "bg-secondary text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Not Available
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drivers Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">License Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Assigned Vehicle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Availability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentDrivers.map((driver) => (
                  <tr 
                    key={driver.id} 
                    className="p-4 md:p-6 bg-dark:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 border-b border-table last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {driver.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {driver.contact}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {driver.assignedVehicle}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(driver.availability)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${driver.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {driver.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDriver(driver)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditDriverProfile(driver)}
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {currentDrivers.map((driver) => (
              <div key={driver.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{driver.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{driver.licenseNumber}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(driver.availability)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${driver.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {driver.availability}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Contact: </span>
                    <span className="text-gray-900 dark:text-gray-100">{driver.contact}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Vehicle: </span>
                    <span className="text-gray-900 dark:text-gray-100">{driver.assignedVehicle}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-1 pt-2">
                  <button 
                    onClick={() => handleViewDriver(driver)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditDriverProfile(driver)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteDriver(driver.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-secondary px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-white">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredDrivers.length)} of {filteredDrivers.length} entries
              </div>
              
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 px-3 py-2 rounded-lg transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                
                <span className="text-sm text-white px-3 py-2">
                  {currentPage} of {totalPages}
                </span>
                
                <Button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 px-3 py-2 rounded-lg transition-all"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={showAddDriverModal}
        onClose={handleCloseModal}
        onSave={handleAddDriver}
      />
    </MainLayout>
  );
}