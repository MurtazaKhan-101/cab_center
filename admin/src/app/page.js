"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { ROUTES } from "./lib/constants";
import { AuthLayout } from "./components/layout/AuthLayout";
import Login from "./components/authentication/login";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return null;
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue to Auth Template"
    >
      <Login />
    </AuthLayout>
  );
}
