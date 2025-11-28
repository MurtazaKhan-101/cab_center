"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./index";
import { useTranslation } from "../../../lib/i18n";

export const PaginationWithI18n = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPrevPage,
  onNextPage,
  className = "",
  showEntryCount = true,
}) => {
  const { t, isRTL } = useTranslation();
  
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1 && totalItems === 0) {
    return null;
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevPage = () => {
    if (currentPage > 1 && onPrevPage) {
      onPrevPage();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && onNextPage) {
      onNextPage();
    }
  };

  return (
    <div className={`px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className} ${isRTL() ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col gap-3">
        {/* Entry count */}
        {showEntryCount && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalItems > 0 ? (
                <>
                  {t('pagination.showing')} {startIndex} {t('pagination.to')} {endIndex} {t('pagination.of')} {totalItems} {t('pagination.entries')}
                </>
              ) : (
                t('pagination.no_entries')
              )}
            </p>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button - Adjust order and arrows for RTL */}
          {isRTL() ? (
            <>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-buttons-gradient hover:bg-buttons-gradient-hover text-white border-none disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:hover:bg-gray-300 dark:disabled:hover:bg-gray-600 flex items-center gap-1 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('pagination.next')}
              </Button>
              
              {/* Page indicator */}
              <div className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-200">
                {currentPage} {t('pagination.page_of')} {totalPages}
              </div>
              
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-buttons-gradient hover:bg-buttons-gradient-hover text-white border-none disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:hover:bg-gray-300 dark:disabled:hover:bg-gray-600 flex items-center gap-1 text-sm"
              >
                {t('pagination.previous')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-buttons-gradient hover:bg-buttons-gradient-hover text-white border-none disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:hover:bg-gray-300 dark:disabled:hover:bg-gray-600 flex items-center gap-1 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('pagination.previous')}
              </Button>
              
              {/* Page indicator */}
              <div className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-200">
                {currentPage} {t('pagination.page_of')} {totalPages}
              </div>
              
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-buttons-gradient hover:bg-buttons-gradient-hover text-white border-none disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:hover:bg-gray-300 dark:disabled:hover:bg-gray-600 flex items-center gap-1 text-sm"
              >
                {t('pagination.next')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginationWithI18n;