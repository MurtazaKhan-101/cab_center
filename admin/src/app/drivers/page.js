"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Spinner, ConfirmationModal } from "../components/ui";
import { ROUTES } from "../lib/constants";
import MainLayout from "../components/layout/MainLayout";
import AddDriverModal from "./AddDriverModal";
import DriverProfile from "./DriverProfile";
import { showToast } from "../lib/toast";
import {
  Edit,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as driverService from "../lib/driver";

export default function DriversPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(7);
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'profile'
  const [isEditMode, setIsEditMode] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Fetch drivers from backend
  useEffect(() => {
    const fetchDrivers = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await driverService.getAllDrivers();
        if (response.success) {
          const transformedDrivers = response.drivers.map((d) => ({
            id: d._id,
            name: d.name,
            licenseNumber: d.license_number,
            contact: d.contact_number,
            assignedVehicle: d.assigned_vehicle_id
              ? `${d.assigned_vehicle_id.model} - ${d.assigned_vehicle_id.registration_number}`
              : "Not Assigned",
            availability:
              d.availability_status === "available"
                ? "Available"
                : "Not Available",
            joinDate: new Date(d.createdAt).toLocaleDateString("en-GB"),
            rating: 4.5,
            status: d.availability_status,
            vehicleId: d.assigned_vehicle_id?._id,
            monthlySalary: d.monthly_salary,
            assignedVehicleType: d.assigned_vehicle_type,
            totalRides: d.total_rides || 0,
            monthlyPresents: d.monthly_presents || 0,
          }));
          setDrivers(transformedDrivers);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        showToast.error("Failed to load drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, loading, isAuthenticated, router]);

  // Filter drivers based on search term and status
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.contact.includes(searchTerm) ||
      driver.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" || driver.availability === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleCloseModal = () => {
    setShowAddDriverModal(false);
  };

  // Driver Profile Handlers
  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setViewMode("profile");
    setIsEditMode(false);
  };

  const handleEditDriverProfile = (driver) => {
    setSelectedDriver(driver);
    setViewMode("profile");
    setIsEditMode(true);
  };

  const handleBackToList = () => {
    setSelectedDriver(null);
    setViewMode("list");
    setIsEditMode(false);
  };

  const handleSaveDriver = async (updatedDriver) => {
    try {
      const updateData = {
        name: updatedDriver.name,
        contact_number: updatedDriver.contact,
        license_number: updatedDriver.licenseNumber,
        monthly_salary: parseFloat(updatedDriver.monthlySalary) || 0,
        availability_status: updatedDriver.availability,
      };

      // Handle vehicle assignment
      if (updatedDriver.assignedVehicleId) {
        updateData.assigned_vehicle_id = updatedDriver.assignedVehicleId;
        updateData.assigned_vehicle_type =
          updatedDriver.vehicleCategory?.toLowerCase();
      } else {
        // Explicitly remove vehicle assignment
        updateData.assigned_vehicle_id = null;
        updateData.assigned_vehicle_type = null;
      }

      const response = await driverService.updateDriver(
        updatedDriver.id,
        updateData
      );

      if (response.success) {
        // Transform the response back to frontend format
        const transformedDriver = {
          id: response.driver._id,
          name: response.driver.name,
          licenseNumber: response.driver.license_number,
          contact: response.driver.contact_number,
          assignedVehicle: response.driver.assigned_vehicle_id
            ? `${response.driver.assigned_vehicle_id.model} - ${response.driver.assigned_vehicle_id.registration_number}`
            : "Not Assigned",
          availability:
            response.driver.availability_status === "available"
              ? "Available"
              : "Not Available",
          joinDate: updatedDriver.joinDate,
          rating: updatedDriver.rating,
          status: response.driver.availability_status,
          vehicleId: response.driver.assigned_vehicle_id?._id,
          monthlySalary: response.driver.monthly_salary,
          assignedVehicleType: response.driver.assigned_vehicle_type,
          totalRides: response.driver.total_rides || 0,
          monthlyPresents: response.driver.monthly_presents || 0,
        };

        setDrivers((prev) =>
          prev.map((driver) =>
            driver.id === updatedDriver.id ? transformedDriver : driver
          )
        );
        setSelectedDriver(transformedDriver);
        showToast.success(
          `Driver "${updatedDriver.name}" has been updated successfully!`
        );
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      showToast.error("Failed to update driver");
    }
  };

  const handleDeleteDriver = (driverId) => {
    const driver = drivers.find((d) => d.id === driverId);
    setDriverToDelete(driver);
    setShowConfirmModal(true);
  };

  const confirmDeleteDriver = async () => {
    if (!driverToDelete) return;

    const loadingToast = showToast.loading("Deleting driver...");

    try {
      const response = await driverService.deleteDriver(driverToDelete.id);

      if (response.success) {
        setDrivers((prev) =>
          prev.filter((driver) => driver.id !== driverToDelete.id)
        );
        setViewMode("list");
        setSelectedDriver(null);
        showToast.success(
          `Driver "${driverToDelete?.name}" has been deleted successfully!`
        );
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      showToast.error("Failed to delete driver");
    } finally {
      setShowConfirmModal(false);
      setDriverToDelete(null);
    }
  };

  const handleAddDriver = async (newDriver) => {
    try {
      const driverData = {
        name: newDriver.name,
        contact_number: newDriver.contact,
        license_number: newDriver.licenseNumber,
        availability_status: "available",
        monthly_salary: parseFloat(newDriver.monthlySalary) || 0,
      };

      // Add vehicle info only if a vehicle is assigned
      if (newDriver.assignedVehicleId) {
        driverData.assigned_vehicle_id = newDriver.assignedVehicleId;
        driverData.assigned_vehicle_type =
          newDriver.vehicleCategory?.toLowerCase() || null;
      }

      const response = await driverService.createDriver(driverData);

      if (response.success) {
        const transformedDriver = {
          id: response.driver._id,
          name: response.driver.name,
          licenseNumber: response.driver.license_number,
          contact: response.driver.contact_number,
          assignedVehicle: response.driver.assigned_vehicle_id
            ? `${response.driver.assigned_vehicle_id.model} - ${response.driver.assigned_vehicle_id.registration_number}`
            : "Not Assigned",
          availability: "Available",
          joinDate: new Date(response.driver.createdAt).toLocaleDateString(
            "en-GB"
          ),
          rating: 4.5,
          status: response.driver.availability_status,
          vehicleId: response.driver.assigned_vehicle_id?._id,
          monthlySalary: response.driver.monthly_salary,
          assignedVehicleType: response.driver.assigned_vehicle_type,
          totalRides: response.driver.total_rides || 0,
          monthlyPresents: response.driver.monthly_presents || 0,
        };

        setDrivers((prev) => [...prev, transformedDriver]);
        showToast.success(
          `Driver "${newDriver.name}" has been added successfully!`
        );
        setShowAddDriverModal(false);
      }
    } catch (error) {
      console.error("Error adding driver:", error);
      showToast.error("Failed to add driver");
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  // Render Driver Profile if in profile view mode
  if (viewMode === "profile" && selectedDriver) {
    return (
      <MainLayout>
        <DriverProfile
          driver={selectedDriver}
          onBack={handleBackToList}
          onEdit={handleSaveDriver}
          onDelete={handleDeleteDriver}
          onSave={handleSaveDriver}
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Driver Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor your drivers
            </p>
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
                        statusFilter === ""
                          ? "bg-secondary text-white"
                          : "text-gray-700 dark:text-gray-300"
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
                        statusFilter === "Available"
                          ? "bg-secondary text-white"
                          : "text-gray-700 dark:text-gray-300"
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
                        statusFilter === "Not Available"
                          ? "bg-secondary text-white"
                          : "text-gray-700 dark:text-gray-300"
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    License Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Assigned Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Availability
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Actions
                  </th>
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
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(
                          driver.availability
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            driver.availability === "Available"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
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
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {driver.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {driver.licenseNumber}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(
                      driver.availability
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        driver.availability === "Available"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {driver.availability}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Contact:{" "}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {driver.contact}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Vehicle:{" "}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {driver.assignedVehicle}
                    </span>
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
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredDrivers.length)} of{" "}
                {filteredDrivers.length} entries
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDriverToDelete(null);
        }}
        onConfirm={confirmDeleteDriver}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        itemName={driverToDelete?.name}
      />

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={showAddDriverModal}
        onClose={handleCloseModal}
        onSave={handleAddDriver}
      />
    </MainLayout>
  );
}
