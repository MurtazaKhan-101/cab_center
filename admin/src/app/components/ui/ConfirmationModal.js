"use client";

import { X, AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger', 'warning', 'info'
  itemName = "",
}) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "bg-red-100 dark:bg-red-900/20",
          iconColor: "text-red-600 dark:text-red-400",
          confirmBtn:
            "bg-red-600 hover:bg-red-700 text-white transition-colors duration-200",
        };
      case "warning":
        return {
          iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          confirmBtn:
            "bg-yellow-600 hover:bg-yellow-700 text-white transition-colors duration-200",
        };
      case "info":
        return {
          iconBg: "bg-blue-100 dark:bg-blue-900/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          confirmBtn:
            "bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200",
        };
      default:
        return {
          iconBg: "bg-red-100 dark:bg-red-900/20",
          iconColor: "text-red-600 dark:text-red-400",
          confirmBtn:
            "bg-red-600 hover:bg-red-700 text-white transition-colors duration-200",
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${typeStyles.iconBg}`}
            >
              <AlertTriangle className={`w-5 h-5 ${typeStyles.iconColor}`} />
            </div>

            {/* Message */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {message}
                {itemName && (
                  <span className="block mt-2 font-medium text-gray-900 dark:text-gray-100">
                    "{itemName}"
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md ${typeStyles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
