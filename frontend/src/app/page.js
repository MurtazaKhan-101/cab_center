"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import BookingInterface from './components/booking/BookingInterface';
import { Spinner } from './components/ui';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to home route
    if (!loading && !isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, will redirect to /home (don't render anything)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, show booking interface
  return <BookingInterface />;
}
