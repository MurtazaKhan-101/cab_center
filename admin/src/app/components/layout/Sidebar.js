"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Car,
  UserCheck,
  Building,
  Calendar,
  X,
  Settings,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Driver Management",
      href: "/drivers",
      icon: Users,
    },
    {
      name: "Car Management",
      href: "/cars",
      icon: Car,
    },
    {
      name: "Client Management",
      href: "/clients",
      icon: UserCheck,
    },
    {
      name: "Company Management",
      href: "/company",
      icon: Building,
    },
    {
      name: "Booking Management",
      href: "/bookings",
      icon: Calendar,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActiveRoute = (href) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/images/logo.svg"
                alt="Cab Centre Logo"
                width={98}
                height={98}
                className=" object-contain"
              />
            </div>
            <span className="text-secondary dark:text-white font-bold text-xl">
              CAB CENTRE
            </span>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close mobile sidebar when navigation item is clicked
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveRoute(item.href)
                        ? "bg-secondary text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-secondary hover:text-white"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 transition-transform duration-200 ${
                        isActiveRoute(item.href) ? "scale-110" : ""
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 mt-auto">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              © 2025 Cab Centre
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Admin Dashboard
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
