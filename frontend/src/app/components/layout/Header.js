"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "../../../lib/i18n";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { ChevronDown } from "lucide-react";

const PUBLIC_NAV = [
  { label: 'Airport ride',   href: '/home' },
  { label: 'City rides',     href: '/city-rides' },
  { label: 'Hourly Service', href: '/hourly-service' },
  { label: 'Help',           href: '/help' },
];

const BUSINESS_LINKS = [
  { label: 'Travel Agencies',    href: '/travel-agencies',    desc: 'Exclusive rates & branded vouchers' },
  { label: 'Business Solutions', href: '/business-solutions', desc: 'Corporate travel management' },
];

const HeaderComponent = ({ user, onLogout, loading = false, isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [businessDropOpen, setBusinessDropOpen] = useState(false);
  const pathname = usePathname();
  const { t, isRTL } = useTranslation();

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
    
    const activeClasses = "bg-white/20 text-white";
    const inactiveClasses = "text-white/80 hover:text-white hover:bg-white/15";
    
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
    if (!isAuthenticated) {
      return (
        <a
          href="/auth/login"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Sign-in
        </a>
      );
    }

    if (loading || isLoggingOut) {
      return (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
            <div className="text-white hidden xl:block">
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
        <div className="flex items-center space-x-4">
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
                <span className="text-[#005F56] text-sm font-semibold">
                  {user.firstName?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
            )}
            <div className="text-white hidden xl:block">
              <span className="text-sm font-medium text-gray-200 dark:text-gray-100">
                  {user.firstName} 
              </span>   
              <p className="text-xs text-gray-200">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleDesktopLogout}
            className="bg-white text-[#005F56] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      );
    }


    if (isLoggingOut) {
      return (
        <div className="flex items-center space-x-4">
          <div className="w-32 h-8 bg-white/20 rounded-md animate-pulse"></div>
        </div>
      );
    }

    return null;
  };

  // Show skeleton mobile user section while loading
  const renderMobileUserSection = () => {
    if (!isAuthenticated) {
      return (
        <a
          href="/auth/login"
          onClick={handleMenuClose}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}
        >
          Sign-in
        </a>
      );
    }

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
                <span className="text-[#005F56] text-lg font-semibold">
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
            className="w-full text-left text-white hover:text-white hover:bg-white/20 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
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

    return null;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#008B7E] border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={isAuthenticated ? "/dashboard" : "/home"} className="flex items-center">
              <Image
                src="/images/logo KSA Rides.png"
                alt="KSA Rides"
                width={240}
                height={72}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={getLinkClasses("/dashboard")}>{t('navigation.home') || 'Home'}</Link>
                <Link href="/booking"   className={getLinkClasses("/booking")}>{t('navigation.booking') || 'Booking'}</Link>
                <Link href="/history"   className={getLinkClasses("/history")}>{t('navigation.history') || 'History'}</Link>
              </>
            ) : (
              <>
                {PUBLIC_NAV.map(({ label, href }) => (
                  <a key={label} href={href} className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/15 transition-colors">{label}</a>
                ))}
                <div className="relative">
                  <button
                    onClick={() => setBusinessDropOpen(v => !v)}
                    onBlur={() => setTimeout(() => setBusinessDropOpen(false), 150)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                  >
                    Business
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${businessDropOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {businessDropOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      onMouseDown={e => e.preventDefault()}
                    >
                      {BUSINESS_LINKS.map(({ label, href, desc }) => (
                        <a key={label} href={href} className="block px-4 py-3 hover:bg-[#EDF4F7] transition-colors">
                          <div className="text-sm font-semibold text-gray-800">{label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Right side: Language + User (hidden for now) */}
          {/* <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            {renderUserSection()}
          </div> */}

          {/* Tablet Controls */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            <button onClick={toggleMenu} className="text-white/70 hover:text-white p-2 rounded-lg transition-colors" aria-expanded={isMenuOpen} aria-label="Toggle menu">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleMenu} className="text-white/70 hover:text-white p-2 rounded-lg transition-colors" aria-expanded={isMenuOpen} aria-label="Toggle menu">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#008B7E] px-2 pt-2 pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={`${getLinkClasses("/dashboard", true)} text-sm`} onClick={handleMenuClose}>{t('navigation.home') || 'Home'}</Link>
                <Link href="/booking"   className={`${getLinkClasses("/booking",   true)} text-sm`} onClick={handleMenuClose}>{t('navigation.booking') || 'Booking'}</Link>
                <Link href="/history"   className={`${getLinkClasses("/history",   true)} text-sm`} onClick={handleMenuClose}>{t('navigation.history') || 'History'}</Link>
              </>
            ) : (
              <>
                {PUBLIC_NAV.map(({ label, href }) => (
                  <a key={label} href={href} onClick={handleMenuClose} className="block px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/15 hover:text-white font-medium text-sm transition-all">{label}</a>
                ))}
                <div className="pt-1 border-t border-white/10">
                  <p className="px-3 pt-2 pb-1 text-xs font-bold text-white/50 uppercase tracking-wide">Business</p>
                  {BUSINESS_LINKS.map(({ label, href }) => (
                    <a key={label} href={href} onClick={handleMenuClose} className="block px-3 py-2 rounded-lg text-white/80 hover:bg-white/15 hover:text-white font-medium text-sm transition-all">{label}</a>
                  ))}
                </div>
              </>
            )}
            {/* Auth section hidden for now */}
            {/* <div className="border-t border-white/10 pt-4 mt-2">
              {renderMobileUserSection()}
            </div> */}
          </div>
        )}
      </div>
    </header>
  );
};

// Memoize the Header component to prevent unnecessary re-renders
export const Header = memo(HeaderComponent);