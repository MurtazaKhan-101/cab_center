"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Spinner } from "../components/ui";
import { ROUTES } from "../lib/constants";
import MainLayout from "../components/layout/MainLayout";
import Image from "next/image";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Car, User, Building, Users } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('week');

  // Sample data for charts
  const revenueData = [
    { name: 'Mon', revenue: 4200, bookings: 45 },
    { name: 'Tue', revenue: 3800, bookings: 38 },
    { name: 'Wed', revenue: 5100, bookings: 52 },
    { name: 'Thu', revenue: 4600, bookings: 48 },
    { name: 'Fri', revenue: 6200, bookings: 65 },
    { name: 'Sat', revenue: 7800, bookings: 82 },
    { name: 'Sun', revenue: 6500, bookings: 71 },
  ];

  const vehicleTypeData = [
    { name: 'Sedan', value: 45, color: '#00188F' },
    { name: 'SUV', value: 30, color: '#5C88D7' },
    { name: 'Luxury', value: 15, color: '#000729' },
    { name: 'Van', value: 10, color: '#3B82F6' },
  ];

  const recentActivities = [
    { 
      type: 'ride_request', 
      user: 'Abdul Moiz', 
      action: 'requested for a ride', 
      time: '20s ago',
      icon: 'car',
      color: 'bg-blue-500'
    },
    { 
      type: 'account_registration', 
      user: 'Ahmed', 
      action: 'registered an account', 
      time: '25m ago',
      icon: 'user',
      color: 'bg-green-500'
    },
    { 
      type: 'account_registration', 
      user: 'Ahmed', 
      action: 'registered an account', 
      time: '3hr ago',
      icon: 'user',
      color: 'bg-green-500'
    },
    { 
      type: 'ride_request', 
      user: 'Abdul Moiz', 
      action: 'requested for a ride', 
      time: '4hr ago',
      icon: 'car',
      color: 'bg-blue-500'
    },
  ];

  const hourlyBookings = [
    { hour: '6AM', bookings: 12 },
    { hour: '9AM', bookings: 35 },
    { hour: '12PM', bookings: 28 },
    { hour: '3PM', bookings: 22 },
    { hour: '6PM', bookings: 45 },
    { hour: '9PM', bookings: 38 },
    { hour: '12AM', bookings: 15 },
  ];

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
      <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
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
          {['Today', 'Week', 'Month', 'Year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range.toLowerCase())}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range.toLowerCase()
                  ? 'bg-ui-cards-gradient text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">+8.2%</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">Total Rides</p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">1,401</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Car className="w-4 h-4 md:w-6 md:h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
              </div>
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">+5.1%</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">Total Cars</p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">56</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <User className="w-4 h-4 md:w-6 md:h-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
              </div>
              <span className="text-red-600 group-hover:text-white text-xs md:text-sm font-semibold">-2.1%</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">Total Drivers</p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">56</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Building className="w-4 h-4 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
              </div>
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">+15%</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">Companies</p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">10</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg hover:bg-ui-cards-gradient hover:text-white transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Users className="w-4 h-4 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
              </div>
              <span className="text-green-600 group-hover:text-white text-xs md:text-sm font-semibold">+12%</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80 mb-1">Clients</p>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">500</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Revenue & Bookings Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
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
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#00188F" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="bookings" stroke="#5C88D7" fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vehicle Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Vehicle Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Bookings & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hourly Bookings */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Bookings by Hour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyBookings}>
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

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                  <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0 transition-transform hover:rotate-12`}>
                    {activity.icon === 'car' ? (
                      <Car className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      

      
      </div>
    </MainLayout>
  );
}
