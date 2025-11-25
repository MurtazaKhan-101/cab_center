"use client";

import toast from 'react-hot-toast';

// Custom toast styles that match the design system
const toastStyles = {
  success: {
    style: {
      background: 'linear-gradient(90deg, #00188F 0%, #000729 100%)',
      color: '#fff',
      border: '1px solid #10B981',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#10B981',
      secondary: '#fff',
    },
  },
  error: {
    style: {
      background: '#FEF2F2',
      color: '#DC2626',
      border: '1px solid #FCA5A5',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#DC2626',
      secondary: '#fff',
    },
  },
  info: {
    style: {
      background: '#EBF8FF',
      color: '#1D4ED8',
      border: '1px solid #93C5FD',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#1D4ED8',
      secondary: '#fff',
    },
  },
  warning: {
    style: {
      background: '#FFFBEB',
      color: '#D97706',
      border: '1px solid #FCD34D',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#D97706',
      secondary: '#fff',
    },
  },
};

// Dark mode styles
const darkToastStyles = {
  success: {
    style: {
      background: 'linear-gradient(90deg, #00188F 0%, #000729 100%)',
      color: '#fff',
      border: '1px solid #10B981',
    },
  },
  error: {
    style: {
      background: '#1F2937',
      color: '#F87171',
      border: '1px solid #DC2626',
    },
  },
  info: {
    style: {
      background: '#1F2937',
      color: '#60A5FA',
      border: '1px solid #3B82F6',
    },
  },
  warning: {
    style: {
      background: '#1F2937',
      color: '#FBBF24',
      border: '1px solid #F59E0B',
    },
  },
};

// Toast utility functions
export const showToast = {
  success: (message, options = {}) => {
    const isDark = document.documentElement.classList.contains('dark');
    const styles = isDark ? darkToastStyles.success : toastStyles.success;
    
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...styles,
      ...options,
    });
  },

  error: (message, options = {}) => {
    const isDark = document.documentElement.classList.contains('dark');
    const styles = isDark ? darkToastStyles.error : toastStyles.error;
    
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      ...styles,
      ...options,
    });
  },

  info: (message, options = {}) => {
    const isDark = document.documentElement.classList.contains('dark');
    const styles = isDark ? darkToastStyles.info : toastStyles.info;
    
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      ...styles,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    const isDark = document.documentElement.classList.contains('dark');
    const styles = isDark ? darkToastStyles.warning : toastStyles.warning;
    
    return toast(message, {
      duration: 4500,
      position: 'top-right',
      ...styles,
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: 'linear-gradient(90deg, #00188F 0%, #000729 100%)',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong!',
      },
      {
        position: 'top-right',
        style: {
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        ...options,
      }
    );
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  },

  custom: (component, options = {}) => {
    return toast.custom(component, {
      position: 'top-right',
      ...options,
    });
  },
};