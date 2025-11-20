"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../ui";
import { useMemo } from "react";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

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

  // Check if current route should show header - show immediately for non-auth routes
  const shouldShowHeader = useMemo(() => 
    !noHeaderRoutes.includes(pathname), 
    [pathname, noHeaderRoutes]
  );

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