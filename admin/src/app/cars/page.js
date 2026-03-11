"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button, Spinner, ConfirmationModal } from "../components/ui";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Car,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import AddCarModal from "./AddCarModal";
import CarProfile from "./CarProfile";
import { showToast } from "../lib/toast";
import * as vehicleService from "../lib/vehicle";

export default function CarsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles from backend
  useEffect(() => {
    const fetchVehicles = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await vehicleService.getAllVehicles();
        if (response.success) {
          const transformedVehicles = response.vehicles.map((v) => ({
            id: v._id,
            category:
              v.vehicle_type.charAt(0).toUpperCase() + v.vehicle_type.slice(1),
            registrationNumber: v.registration_number,
            model: v.model,
            year: v.year,
            assignedTo: v.assigned_driver_id?.name || "Not Assigned",
            availability:
              v.availability_status === "available"
                ? "Available"
                : "Unavailable",
            capacity: v.capacity,
            farePerKm: v.fare_per_km,
            status: v.availability_status,
            driverId: v.assigned_driver_id?._id,
          }));
          setCars(transformedVehicles);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        showToast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [authLoading, isAuthenticated]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter cars based on search and availability
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterAvailability === "all" || car.availability === filterAvailability;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddCar = async (carData) => {
    const toastId = showToast.loading("Adding vehicle...");

    try {
      const response = await vehicleService.createVehicle({
        registration_number: carData.registrationNumber,
        model: carData.model,
        vehicle_type: carData.category.toLowerCase(),
        year: parseInt(carData.year),
        capacity: parseInt(carData.capacity || 4),
        farePerKm: parseFloat(carData.farePerKm || 10),
        availability_status: "available",
      });

      if (response.success) {
        const transformedVehicle = {
          id: response.vehicle._id,
          category:
            response.vehicle.vehicle_type.charAt(0).toUpperCase() +
            response.vehicle.vehicle_type.slice(1),
          registrationNumber: response.vehicle.registration_number,
          model: response.vehicle.model,
          year: response.vehicle.year,
          assignedTo: "Not Assigned",
          availability: "Available",
          capacity: response.vehicle.capacity,
          farePerKm: response.vehicle.fare_per_km,
          status: response.vehicle.availability_status,
        };

        setCars([...cars, transformedVehicle]);
        setShowAddModal(false);
        showToast.success("Vehicle added successfully!", toastId);
      } else {
        showToast.error(response.message || "Failed to add vehicle", toastId);
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      showToast.error("Failed to add vehicle. Please try again.", toastId);
    }
  };

  const handleEditCar = async (carData) => {
    const toastId = showToast.loading("Updating vehicle...");

    try {
      const response = await vehicleService.updateVehicle(carData.id, {
        registration_number: carData.registrationNumber,
        model: carData.model,
        vehicle_type: carData.category.toLowerCase(),
        year: parseInt(carData.year),
        capacity: parseInt(carData.capacity || 4),
        farePerKm: parseFloat(carData.farePerKm || 10),
        availability_status: carData.status,
      });

      if (response.success) {
        setCars(cars.map((car) => (car.id === carData.id ? carData : car)));
        setSelectedCar(carData);
        showToast.success("Vehicle updated successfully!", toastId);
      } else {
        showToast.error(
          response.message || "Failed to update vehicle",
          toastId
        );
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      showToast.error("Failed to update vehicle. Please try again.", toastId);
    }
  };

  const handleDeleteCar = (carId) => {
    const car = cars.find((c) => c.id === carId);
    setCarToDelete(car);
    setShowConfirmModal(true);
  };

  const confirmDeleteCar = async () => {
    if (!carToDelete) return;

    const toastId = showToast.loading("Deleting vehicle...");

    try {
      const response = await vehicleService.deleteVehicle(carToDelete.id);

      if (response.success) {
        setCars(cars.filter((car) => car.id !== carToDelete.id));
        setShowProfile(false);
        setSelectedCar(null);
        showToast.success("Vehicle deleted successfully!", toastId);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      showToast.error("Failed to delete vehicle. Please try again.", toastId);
    } finally {
      setShowConfirmModal(false);
      setCarToDelete(null);
    }
  };

  const handleViewCar = (car) => {
    setSelectedCar(car);
    setEditMode(false);
    setShowProfile(true);
  };

  const handleEditClick = (car) => {
    setSelectedCar(car);
    setEditMode(true);
    setShowProfile(true);
  };

  if (showProfile && selectedCar) {
    return (
      <MainLayout>
        <CarProfile
          car={selectedCar}
          onBack={() => {
            setShowProfile(false);
            setSelectedCar(null);
            setEditMode(false);
          }}
          onEdit={() => setEditMode(true)}
          onDelete={handleDeleteCar}
          onSave={handleEditCar}
          initialEditMode={editMode}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Car Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your fleet vehicles and assignments
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-buttons-gradient hover:bg-buttons-gradient-hover text-white px-6 py-3 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Vehicle</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-ui-cards-gradient dark:bg-gray-800 rounded-xl p-6 shadow-lg text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium  text-white dark:text-gray-400 group-hover:text-white/80">
                  Total Vehicles
                </p>
                <p className="text-2xl font-bold text-white dark:text-white group-hover:text-white">
                  {cars.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white dark:text-blue-400 group-hover:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                  Available
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-white">
                  {
                    cars.filter((car) => car.availability === "Available")
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                  In Use
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-white">
                  {
                    cars.filter((car) => car.availability === "Unavailable")
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/80">
                  This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-white">
                  32
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vehicles by model, registration, assigned driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="all">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Table */}
        <div className="bg-white  dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Registration #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Model
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Assigned to
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
                {paginatedCars.map((car) => (
                  <tr
                    key={car.id}
                    className="p-4 md:p-6 bg-dark:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 border-b border-table last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {car.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {car.registrationNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {car.model}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {car.year}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {car.assignedTo}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          car.availability === "Available"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            car.availability === "Available"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {car.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCar(car)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(car)}
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-secondary px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-white">
                Showing {Math.min(filteredCars.length, itemsPerPage)} of{" "}
                {filteredCars.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  variant="outline"
                  className="px-3 py-1 text-sm bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="px-3 py-1 text-sm bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setCarToDelete(null);
          }}
          onConfirm={confirmDeleteCar}
          title="Delete Vehicle"
          message="Are you sure you want to delete this vehicle? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          itemName={
            carToDelete
              ? `${carToDelete.model} (${carToDelete.registrationNumber})`
              : ""
          }
        />

        {/* Add Car Modal */}
        <AddCarModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCar}
        />
      </div>
    </MainLayout>
  );
}
