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
  const [chartData, setChartData] = useState({
    revenueData: [],
    vehicleTypeData: [],
    recentBookings: [],
    hourlyBookings: [],
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
          const bookings = bookingsRes.bookings || [];
          const drivers = driversRes.drivers || [];
          const vehicles = vehiclesRes.vehicles || [];

          // Filter bookings based on selected time range
          const filteredBookings = filterDataByTimeRange(bookings, timeRange);

          // Calculate stats based on filtered data
          const totalRevenue = filteredBookings
            .filter((b) => b.status === "completed")
            .reduce((sum, b) => sum + (b.total_fare || 0), 0);

          const activeRides = filteredBookings.filter(
            (b) => b.status === "approved" || b.status === "pending"
          ).length;

          setStats({
            totalRides: filteredBookings.length,
            totalCars: vehicles.length, // Keep total vehicles as is (not time-dependent)
            totalDrivers: drivers.length, // Keep total drivers as is (not time-dependent)
            totalRevenue: totalRevenue,
            activeRides: activeRides,
          });

          // Process data for charts with filtered bookings
          processChartData(filteredBookings, drivers, vehicles, timeRange);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, isAuthenticated, timeRange]);

  // Helper function to filter data based on time range
  const filterDataByTimeRange = (data, timeRange) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return data.filter(item => {
      const itemDate = new Date(item.created_at || item.date);
      
      switch (timeRange) {
        case 'today':
          return itemDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return itemDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return itemDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(today);
          yearAgo.setFullYear(today.getFullYear() - 1);
          return itemDate >= yearAgo;
        default:
          return true;
      }
    });
  };

  // Process data for charts
  const processChartData = (bookings, drivers, vehicles, timeRange) => {
    // Determine the number of days to show based on time range
    const getDaysCount = (range) => {
      switch (range) {
        case 'today': return 1;
        case 'week': return 7;
        case 'month': return 30;
        case 'year': return 365;
        default: return 7;
      }
    };
    
    const daysCount = getDaysCount(timeRange);
    
    // Revenue trend data based on selected time range
    const trendData = [];
    const today = new Date();
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date).toISOString().split('T')[0];
        return bookingDate === dateStr;
      });
      
      const dayRevenue = dayBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_fare || 0), 0);
      
      // Format the name based on time range
      let name;
      if (timeRange === 'today') {
        name = date.toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (timeRange === 'week') {
        name = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (timeRange === 'month') {
        name = date.toLocaleDateString('en-US', { day: 'numeric' });
      } else {
        name = date.toLocaleDateString('en-US', { month: 'short' });
      }
      
      trendData.push({
        name,
        revenue: dayRevenue,
        bookings: dayBookings.length
      });
    }

    // Vehicle type distribution
    const vehicleTypes = {};
    const colors = ['#00188F', '#5C88D7', '#000729', '#3B82F6', '#8B5CF6'];
    
    vehicles.forEach(vehicle => {
      const type = vehicle.vehicle_type || 'Other';
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      vehicleTypes[capitalizedType] = (vehicleTypes[capitalizedType] || 0) + 1;
    });
    
    const vehicleTypeArray = Object.entries(vehicleTypes).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));

    // Recent bookings (last 5)
    const recentBookingsData = bookings
      .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
      .slice(0, 5)
      .map(booking => ({
        id: booking._id,
        pickup: booking.pickup || 'N/A',
        drop: booking.drop || 'N/A',
        date: booking.date,
        time: booking.time,
        status: booking.status,
        fare: booking.total_fare || 0,
        passengerName: booking.user_name || 'Anonymous',
        vehicleType: booking.vehicle_type || 'N/A'
      }));

    // Hourly bookings distribution
    const hourlyStats = {};
    for (let i = 0; i < 24; i += 3) {
      const hour = i === 0 ? '12AM' : i < 12 ? `${i}AM` : i === 12 ? '12PM' : `${i - 12}PM`;
      hourlyStats[hour] = 0;
    }
    
    bookings.forEach(booking => {
      if (booking.time) {
        const [hours] = booking.time.split(':').map(Number);
        const roundedHour = Math.floor(hours / 3) * 3;
        const hourLabel = roundedHour === 0 ? '12AM' : roundedHour < 12 ? `${roundedHour}AM` : roundedHour === 12 ? '12PM' : `${roundedHour - 12}PM`;
        if (hourlyStats.hasOwnProperty(hourLabel)) {
          hourlyStats[hourLabel] += 1;
        }
      }
    });
    
    const hourlyArray = Object.entries(hourlyStats).map(([hour, bookings]) => ({
      hour,
      bookings
    }));

    setChartData({
      revenueData: trendData,
      vehicleTypeData: vehicleTypeArray,
      recentBookings: recentBookingsData,
      hourlyBookings: hourlyArray,
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, loading, isAuthenticated, router]);

  // Helper function to get time range display text
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'today': return "Today's";
      case 'week': return "This Week's";
      case 'month': return "This Month's";
      case 'year': return "This Year's";
      default: return "Total";
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
              {getTimeRangeText()} Rides
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
              {getTimeRangeText()} Revenue (SAR)
            </p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
              {loading ? "..." : `${stats.totalRevenue.toLocaleString()}`}
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
              {getTimeRangeText()} Active Rides
            </p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
              {loading ? "..." : stats.activeRides}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Revenue & Bookings Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00188F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00188F" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5C88D7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#5C88D7" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#d2d4d7', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#000000'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#00188F" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (SAR)" />
                <Area type="monotone" dataKey="bookings" stroke="#5C88D7" fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vehicle Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Vehicle Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#e9eaeb', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Bookings - Full Width */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Bookings by Hour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.hourlyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="bookings" fill="#00188F" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings - Full Width */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Bookings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {chartData.recentBookings.length > 0 ? (
                chartData.recentBookings.map((booking, index) => {
                  const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  };
                  
                  const formatTime = (timeString) => {
                    if (!timeString) return 'N/A';
                    const [hours, minutes] = timeString.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    return `${hour12}:${minutes} ${ampm}`;
                  };
                  
                  const getStatusColor = (status) => {
                    switch (status?.toLowerCase()) {
                      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                      case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                    }
                  };
                  
                  return (
                    <div key={booking.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                            {booking.passengerName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {booking.vehicleType} • SAR {booking.fare}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span className="truncate">{booking.pickup}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span className="truncate">{booking.drop}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span>{formatDate(booking.date)}</span>
                          <span>{formatTime(booking.time)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No recent bookings available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
