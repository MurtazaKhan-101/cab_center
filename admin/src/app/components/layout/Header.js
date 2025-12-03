"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut, ChevronDown, User } from "lucide-react";
import Image from "next/image";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary transition-colors"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="text-lg font-semibold  text-primary dark:text-white truncate">
            {title}
          </h1>
          
          {/* Mobile User Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-opacity-90 transition-colors"
            >
              {getUserInitials()}
            </button>
            
            {/* Mobile User Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Close menu overlay */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-secondary dark:text-white">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {/* Desktop User Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-secondary font-medium">
                          {user?.role || "Administrator"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                     <User className="w-4 h-4" /> 
                      <span>Profile Settings</span>
                    </button>
                   
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Close menu overlay */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;