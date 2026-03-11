"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button, Spinner } from "../components/ui";
import {
  Settings as SettingsIcon,
  Clock,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { showToast } from "../lib/toast";
import * as settingsService from "../lib/settings";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [rushHours, setRushHours] = useState([]);

  // Form states
  const [baseFare, setBaseFare] = useState("");
  const [showAddRushHourModal, setShowAddRushHourModal] = useState(false);
  const [editingRushHour, setEditingRushHour] = useState(null);
  const [updatingBaseFare, setUpdatingBaseFare] = useState(false);

  // Rush hour form state
  const [rushHourForm, setRushHourForm] = useState({
    name: "",
    start_time: "",
    end_time: "",
    multiplier: "",
    days_of_week: [],
    locations: [""],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && mounted) {
      fetchSettings();
    }
  }, [isAuthenticated, mounted]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, rushHoursRes] = await Promise.all([
        settingsService.getSettings(),
        settingsService.getRushHours(),
      ]);

      if (settingsRes.success) {
        setSettings(settingsRes.settings);
        setBaseFare(settingsRes.settings.base_fare.toString());
      }

      if (rushHoursRes.success) {
        setRushHours(rushHoursRes.rush_hours);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      showToast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBaseFare = async () => {
    if (!baseFare || isNaN(baseFare) || parseFloat(baseFare) < 0) {
      showToast.error("Please enter a valid base fare");
      return;
    }

    setUpdatingBaseFare(true);
    try {
      const response = await settingsService.updateBaseFare(
        parseFloat(baseFare)
      );
      if (response.success) {
        setSettings(response.settings);
        showToast.success("Base fare updated successfully!");
      }
    } catch (error) {
      console.error("Error updating base fare:", error);
      showToast.error("Failed to update base fare");
    } finally {
      setUpdatingBaseFare(false);
    }
  };

  const handleAddRushHour = async () => {
    if (
      !rushHourForm.name.trim() ||
      !rushHourForm.start_time ||
      !rushHourForm.end_time ||
      !rushHourForm.multiplier ||
      rushHourForm.days_of_week.length === 0 ||
      rushHourForm.locations.filter((loc) => loc.trim()).length === 0
    ) {
      showToast.error(
        "Please fill in all fields and select at least one day and location"
      );
      return;
    }

    if (
      isNaN(rushHourForm.multiplier) ||
      parseFloat(rushHourForm.multiplier) < 1
    ) {
      showToast.error("Multiplier must be at least 1");
      return;
    }

    const toastId = showToast.loading("Adding rush hour...");
    try {
      const response = await settingsService.addRushHour({
        name: rushHourForm.name.trim(),
        start_time: rushHourForm.start_time,
        end_time: rushHourForm.end_time,
        multiplier: parseFloat(rushHourForm.multiplier),
        days_of_week: rushHourForm.days_of_week,
        locations: rushHourForm.locations
          .filter((loc) => loc.trim())
          .map((loc) => loc.trim()),
      });

      if (response.success) {
        setRushHours(response.settings.rush_hours);
        setRushHourForm({
          name: "",
          start_time: "",
          end_time: "",
          multiplier: "",
          days_of_week: [],
          locations: [""],
        });
        setShowAddRushHourModal(false);
        showToast.success("Rush hour added successfully!", toastId);
      }
    } catch (error) {
      console.error("Error adding rush hour:", error);
      showToast.error("Failed to add rush hour", toastId);
    }
  };

  const handleUpdateRushHour = async () => {
    if (
      !rushHourForm.name.trim() ||
      !rushHourForm.start_time ||
      !rushHourForm.end_time ||
      !rushHourForm.multiplier ||
      rushHourForm.days_of_week.length === 0 ||
      rushHourForm.locations.filter((loc) => loc.trim()).length === 0
    ) {
      showToast.error(
        "Please fill in all fields and select at least one day and location"
      );
      return;
    }

    if (
      isNaN(rushHourForm.multiplier) ||
      parseFloat(rushHourForm.multiplier) < 1
    ) {
      showToast.error("Multiplier must be at least 1");
      return;
    }

    const toastId = showToast.loading("Updating rush hour...");
    try {
      const response = await settingsService.updateRushHour(
        editingRushHour._id,
        {
          name: rushHourForm.name.trim(),
          start_time: rushHourForm.start_time,
          end_time: rushHourForm.end_time,
          multiplier: parseFloat(rushHourForm.multiplier),
          days_of_week: rushHourForm.days_of_week,
          locations: rushHourForm.locations
            .filter((loc) => loc.trim())
            .map((loc) => loc.trim()),
        }
      );

      if (response.success) {
        setRushHours(response.settings.rush_hours);
        setEditingRushHour(null);
        setRushHourForm({
          name: "",
          start_time: "",
          end_time: "",
          multiplier: "",
          days_of_week: [],
          locations: [""],
        });
        showToast.success("Rush hour updated successfully!", toastId);
      }
    } catch (error) {
      console.error("Error updating rush hour:", error);
      showToast.error("Failed to update rush hour", toastId);
    }
  };

  const handleDeleteRushHour = async (rushHour) => {
    if (
      !confirm(`Are you sure you want to delete "${rushHour.name}" rush hour?`)
    ) {
      return;
    }

    const toastId = showToast.loading("Deleting rush hour...");
    try {
      const response = await settingsService.deleteRushHour(rushHour._id);
      if (response.success) {
        setRushHours(response.settings.rush_hours);
        showToast.success("Rush hour deleted successfully!", toastId);
      }
    } catch (error) {
      console.error("Error deleting rush hour:", error);
      showToast.error("Failed to delete rush hour", toastId);
    }
  };

  const startEditRushHour = (rushHour) => {
    setEditingRushHour(rushHour);
    setRushHourForm({
      name: rushHour.name,
      start_time: rushHour.start_time,
      end_time: rushHour.end_time,
      multiplier: rushHour.multiplier.toString(),
      days_of_week: rushHour.days_of_week || [],
      locations: rushHour.locations || [""],
    });
  };

  const cancelEdit = () => {
    setEditingRushHour(null);
    setShowAddRushHourModal(false);
    setRushHourForm({
      name: "",
      start_time: "",
      end_time: "",
      multiplier: "",
      days_of_week: [],
      locations: [""],
    });
  };

  const handleDayToggle = (day) => {
    setRushHourForm((prev) => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter((d) => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  const handleLocationChange = (index, value) => {
    setRushHourForm((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) => (i === index ? value : loc)),
    }));
  };

  const addLocation = () => {
    setRushHourForm((prev) => ({
      ...prev,
      locations: [...prev.locations, ""],
    }));
  };

  const removeLocation = (index) => {
    if (rushHourForm.locations.length > 1) {
      setRushHourForm((prev) => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index),
      }));
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!mounted || authLoading || loading) {
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Settings Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure base fare (SAR), rush hours, and fare multipliers
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          {/* Base Fare Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="bg-secondary px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Base Fare Settings</span>
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Base Fare */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Base Fare (SAR)
                </label>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  SAR {settings?.base_fare}
                </div>
              </div>

              {/* Update Base Fare */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Base Fare (SAR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder="Enter base fare in SAR"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleUpdateBaseFare}
                    disabled={updatingBaseFare}
                    className="w-full sm:w-auto px-6 py-3 bg-ui-cards-gradient text-white hover:bg-buttons-gradient-hover transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {updatingBaseFare ? (
                      <Spinner size="sm" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Update</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rush Hours Management */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="bg-secondary px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Rush Hours Management</span>
            </h3>
            <Button
              onClick={() => setShowAddRushHourModal(true)}
              className="bg-white text-white hover:bg-gray-100 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rush Hour</span>
            </Button>
          </div>

          <div className="p-6">
            {rushHours.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Rush Hours Configured
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add rush hours to apply different fare multipliers during peak
                  times.
                </p>
                <Button
                  onClick={() => setShowAddRushHourModal(true)}
                  className="bg-ui-cards-gradient text-white hover:bg-buttons-gradient-hover flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Rush Hour</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rushHours.map((rushHour) => (
                  <div
                    key={rushHour._id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {rushHour.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditRushHour(rushHour)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRushHour(rushHour)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Time:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTime(rushHour.start_time)} -{" "}
                          {formatTime(rushHour.end_time)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Multiplier:
                        </span>
                        <span className="font-bold text-secondary">
                          {rushHour.multiplier}x
                        </span>
                      </div>
                      {rushHour.days_of_week &&
                        rushHour.days_of_week.length > 0 && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 block mb-1">
                              Days:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {rushHour.days_of_week.map((day) => (
                                <span
                                  key={day}
                                  className="px-2 py-1 bg-secondary text-white text-xs rounded-full"
                                >
                                  {day.charAt(0).toUpperCase() +
                                    day.slice(1, 3)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {rushHour.locations && rushHour.locations.length > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 block mb-1">
                            Locations:
                          </span>
                          <div className="space-y-1">
                            {rushHour.locations
                              .slice(0, 2)
                              .map((location, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded"
                                >
                                  {location}
                                </div>
                              ))}
                            {rushHour.locations.length > 2 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                +{rushHour.locations.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Rush Hour Modal */}
        {(showAddRushHourModal || editingRushHour) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-secondary p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>
                      {editingRushHour ? "Edit Rush Hour" : "Add Rush Hour"}
                    </span>
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    Configure rush hour pricing multiplier
                  </p>
                </div>
                <button
                  onClick={cancelEdit}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={rushHourForm.name}
                    onChange={(e) =>
                      setRushHourForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder="e.g., Morning Rush"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={rushHourForm.start_time}
                      onChange={(e) =>
                        setRushHourForm((prev) => ({
                          ...prev,
                          start_time: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={rushHourForm.end_time}
                      onChange={(e) =>
                        setRushHourForm((prev) => ({
                          ...prev,
                          end_time: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fare Multiplier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={rushHourForm.multiplier}
                    onChange={(e) =>
                      setRushHourForm((prev) => ({
                        ...prev,
                        multiplier: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder="e.g., 1.5"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Fare will be multiplied by this amount during this time
                    period
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Days of Week <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <label
                        key={day}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={rushHourForm.days_of_week.includes(day)}
                          onChange={() => handleDayToggle(day)}
                          className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {day.substring(0, 3)}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select at least one day for this rush hour to apply
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Locations <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {rushHourForm.locations.map((location, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={location}
                          onChange={(e) =>
                            handleLocationChange(index, e.target.value)
                          }
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                          placeholder="e.g., Riyadh City Center, Al Olaya District"
                        />
                        {rushHourForm.locations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLocation(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLocation}
                      className="flex items-center space-x-2 text-sm text-secondary hover:text-secondary-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Another Location</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Specify locations where this rush hour multiplier will apply
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    editingRushHour ? handleUpdateRushHour : handleAddRushHour
                  }
                  variant="primary"
                  className="px-6 py-2"
                >
                  {editingRushHour ? "Update Rush Hour" : "Add Rush Hour"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
