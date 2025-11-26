"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Spinner } from "../components/ui";
import { ROUTES } from "../lib/constants";
import MainLayout from "../components/layout/MainLayout";
import Image from "next/image";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Car, User, Building, Users } from "lucide-react";
import * as bookingService from "../lib/booking";
import * as driverService from "../lib/driver";
import * as vehicleService from "../lib/vehicle";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalCars: 0,
    totalDrivers: 0,
    totalRevenue: 0,
    activeRides: 0,
  });

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const [bookingsRes, driversRes, vehiclesRes] = await Promise.all([
          bookingService.getAllBookings(),
          driverService.getAllDrivers(),
          vehicleService.getAllVehicles(),
        ]);

        if (bookingsRes.success && driversRes.success && vehiclesRes.success) {
          const totalRevenue = bookingsRes.bookings
            .filter((b) => b.status === "completed")
            .reduce((sum, b) => sum + b.total_fare, 0);

          const activeRides = bookingsRes.bookings.filter(
            (b) => b.status === "approved" || b.status === "pending"
          ).length;

          setStats({
            totalRides: bookingsRes.bookings.length,
            totalCars: vehiclesRes.vehicles.length,
            totalDrivers: driversRes.drivers.length,
            totalRevenue: totalRevenue,
            activeRides: activeRides,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, loading, isAuthenticated, router]);

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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] p-4 md:p-6 lg:p-8">
        {/* Time Range Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["Today", "Week", "Month", "Year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range.toLowerCase())}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range.toLowerCase()
                  ? "bg-ui-cards-gradient text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Calendar className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
              </div>
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">
                +8.2%
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">
              Total Rides
            </p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
              {loading ? "..." : stats.totalRides.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Car className="w-4 h-4 md:w-6 md:h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
              </div>
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">
                +5.1%
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">
              Total Cars
            </p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
              {loading ? "..." : stats.totalCars}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <User className="w-4 h-4 md:w-6 md:h-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
              </div>
              <span className="text-red-600 group-hover:text-white text-xs md:text-sm font-semibold">
                -2.1%
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">
              Total Drivers
            </p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
              {loading ? "..." : stats.totalDrivers}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Building className="w-4 h-4 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
              </div>
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">
                +{Math.round((stats.totalRevenue / 10000) * 100) / 100}%
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">
              Total Revenue
            </p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
              {loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Users className="w-4 h-4 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
              </div>
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">
                Active
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">
              Active Rides
            </p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
              {loading ? "..." : stats.activeRides}
            </p>
          </div>
        </div>

        {/* Charts Grid - Placeholder for future analytics */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Analytics Dashboard
            </h3>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced analytics and charts coming soon
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Revenue trends, booking patterns, and performance metrics will
                  be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
