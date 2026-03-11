"use client";

import { Card } from "../ui";
import { useTranslation } from "../../../lib/i18n";

export const AuthLayout = ({ children, title, subtitle }) => {
  const { t, isInitialized } = useTranslation();

  // Prevent content flash during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            {t('auth.terms_footer')}{' '}
            <a href="#" className="text-[#00188F] hover:underline">
              {t('auth.terms_of_service')}
            </a>{' '}
            {t('auth.and')}{' '}
            <a href="#" className="text-[#00188F] hover:underline">
              {t('auth.privacy_policy')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
