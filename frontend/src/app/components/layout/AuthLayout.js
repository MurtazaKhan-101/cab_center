"use client";

import { Card } from "../ui";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <Card className="p-8">
          {title && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
