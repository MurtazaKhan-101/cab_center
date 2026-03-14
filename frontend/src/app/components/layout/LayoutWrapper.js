"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../ui";
import { useMemo } from "react";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const { user, logout, loading, isAuthenticated } = useAuth();

  // Only auth routes should hide the global header
  const noHeaderRoutes = useMemo(() => [
    "/auth/login", "/auth/signup", "/auth/forgot-password",
    "/auth/reset-password", "/auth/verify-otp",
    "/auth/verify-reset-otp", "/auth/oauth-success",
  ], []);

  const shouldShowHeader = useMemo(() => {
    return !noHeaderRoutes.some(route => pathname.startsWith(route));
  }, [pathname, noHeaderRoutes]);

  return (
    <>
      {shouldShowHeader && (
        <Header user={user} onLogout={logout} loading={loading} isAuthenticated={isAuthenticated} />
      )}
      <main>
        {children}
      </main>
    </>
  );
};

export default LayoutWrapper;