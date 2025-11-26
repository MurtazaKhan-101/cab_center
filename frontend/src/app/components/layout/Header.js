"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const HeaderComponent = ({ user, onLogout, loading = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActiveLink = useCallback((href) => {
    if (href === "/dashboard" && (pathname === "/" || pathname === "/dashboard")) {
      return true;
    }
    return pathname === href;
  }, [pathname]);

  // Helper function to get link classes
  const getLinkClasses = useCallback((href, isMobile = false) => {
    const baseClasses = isMobile
      ? "block px-3 py-2 rounded-lg font-medium transition-colors"
      : "px-3 py-2 rounded-lg text-sm font-medium transition-colors";
    
    const activeClasses = "bg-[#5C88D7] text-white";
    const inactiveClasses = "text-white hover:text-white hover:bg-[#5C88D7]";
    
    return `${baseClasses} ${isActiveLink(href) ? activeClasses : inactiveClasses}`;
  }, [isActiveLink]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogoutAndCloseMenu = useCallback(async () => {
    setIsLoggingOut(true);
    if (onLogout) {
      await onLogout();   
    }
    setIsMenuOpen(false);
  }, [onLogout]);

  // Handle desktop logout
  const handleDesktopLogout = useCallback(async () => {
    setIsLoggingOut(true);
    if (onLogout) {
      await onLogout();
    }
  }, [onLogout]);

  // Show skeleton user section while loading
  const renderUserSection = () => {
    if (loading || isLoggingOut) {
      return (
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
            <div className="text-white">
              <div className="w-16 h-3 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="w-24 h-3 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-16 h-8 bg-white/20 rounded-md animate-pulse"></div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name || user.email}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#00188F] text-sm font-semibold">
                  {user.firstName?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
            )}
            <div className="text-white">
              <span className="text-sm hidden sm:flex font-medium text-gray-200 dark:text-gray-100">
                  {user.firstName} 
              </span>   
              <p className="text-xs text-gray-200">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleDesktopLogout}
            className="bg-white text-[#00188F] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      );
    }


    if (isLoggingOut) {
      return (
        <div className="hidden md:flex items-center space-x-4">
          <div className="w-32 h-8 bg-white/20 rounded-md animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-4">
        <Link
          href="/auth/login"
          className="bg-[#5C88D7] text-white hover:bg-[#4A75C4] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="bg-white text-[#00188F] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  };

  // Show skeleton mobile user section while loading
  const renderMobileUserSection = () => {
    if (loading || isLoggingOut) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 px-3">
            <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
            <div className="text-white">
              <div className="w-20 h-4 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="w-32 h-3 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-full h-10 bg-white/20 rounded-lg animate-pulse mx-3"></div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 px-3">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name || user.email}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#00188F] text-lg font-semibold">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
            )}
            <div className="text-white">
              <p className="text-base font-medium">{user.name || 'User'}</p>
              <p className="text-sm text-gray-200">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogoutAndCloseMenu}
            className="w-full text-left text-white hover:text-white hover:bg-[#5C88D7] block px-3 py-2 rounded-lg text-base font-medium transition-colors"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      );
    }

    // Don't show login/signup buttons if user is logging out
    if (isLoggingOut) {
      return (
        <div className="space-y-1">
          <div className="w-full h-10 bg-white/20 rounded-lg animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <Link
          href="/auth/login"
          className="bg-[#5C88D7] text-white hover:bg-[#4A75C4] block px-3 py-2 rounded-lg text-base font-medium transition-colors text-center"
          onClick={handleMenuClose}
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="text-white hover:text-white hover:bg-[#5C88D7] block px-3 py-2 rounded-lg text-base font-medium transition-colors text-center"
          onClick={handleMenuClose}
        >
          Sign Up
        </Link>
      </div>
    );
  };

  return (
    <header className="bg-buttons-gradient shadow-lg rounded-lg mx-4 mt-4 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16 ">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Cab Centre Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-white hidden sm:block">
                Cab Centre
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/dashboard"
              className={getLinkClasses("/dashboard")}
            >
              Home
            </Link>
            <Link
              href="/booking"
              className={getLinkClasses("/booking")}
            >
              Booking
            </Link>
            <Link
              href="/history"
              className={getLinkClasses("/history")}
            >
              History
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          {renderUserSection()}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-200 p-2 rounded-lg transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-b-lg">
              <Link
                href="/dashboard"
                className={`${getLinkClasses("/dashboard", true)} text-base`}
                onClick={handleMenuClose}
              >
                Home
              </Link>
              <Link
                href="/booking"
                className={`${getLinkClasses("/booking", true)} text-base`}
                onClick={handleMenuClose}
              >
                Booking
              </Link>
              <Link
                href="/history"
                className={`${getLinkClasses("/history", true)} text-base`}
                onClick={handleMenuClose}
              >
                History
              </Link>

              {/* Mobile User Section */}
              <div className="border-t border-white/20 pt-4 mt-4">
                {renderMobileUserSection()}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Memoize the Header component to prevent unnecessary re-renders
export const Header = memo(HeaderComponent);