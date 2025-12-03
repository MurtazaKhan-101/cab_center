"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../ui";
import { useMemo } from "react";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const { user, logout, loading, isAuthenticated } = useAuth();

  // Routes where header should not appear
  const noHeaderRoutes = useMemo(() => [
    "/auth/login",
    "/auth/signup", 
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-otp",
    "/auth/verify-reset-otp",
    "/auth/oauth-success"
  ], []);

  // Check if current route should show header
  const shouldShowHeader = useMemo(() => {
    // Don't show header on auth routes
    if (noHeaderRoutes.includes(pathname)) {
      return false;
    }
    
    // Don't show header on homepage if user is not authenticated
    if (pathname === "/" && !isAuthenticated) {
      return false;
    }
    
    // Show header for all other cases (authenticated users on any route)
    return isAuthenticated;
  }, [pathname, noHeaderRoutes, isAuthenticated]);

  return (
    <>
      {shouldShowHeader && <Header user={user} onLogout={logout} loading={loading} />}
      <main className={shouldShowHeader ? "pt-0" : ""}>
        {children}
      </main>
    </>
  );
};

export default LayoutWrapper;