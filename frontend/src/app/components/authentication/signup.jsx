"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Alert, Spinner, Divider } from "../ui";
import { ROUTES, API_BASE_URL } from "../../lib/constants";
import { useTranslation } from "../../../lib/i18n";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
  const { t, isInitialized } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prevent content flash during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("errors.first_name_required");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("errors.last_name_required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("errors.email_required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("errors.email_invalid");
    }

    if (!formData.password) {
      newErrors.password = t("errors.password_required");
    } else if (formData.password.length < 8) {
      newErrors.password = t("errors.password_min_length");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );

      if (result.success) {
        setAlert({
          type: "success",
          message: t("success.registration_success"),
        });
        // Redirect to OTP verification page
        setTimeout(() => {
          window.location.href = `${
            ROUTES.VERIFY_OTP
          }?email=${encodeURIComponent(formData.email)}`;
        }, 1500);
      } else {
        setAlert({
          type: "error",
          message: result.message || t("errors.registration_failed"),
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || t("errors.generic_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Left Side - Hero Section with Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00188F] to-[#000729] items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            {/* <img
              src="/images/logo.svg"
              alt={t('auth.logo_alt')}
              className="mx-auto mb-6"
              width={120}
              height={120}
            /> */}
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {t("auth.welcome_cab_center")}
          </h1>
          <p className="text-xl opacity-90 mb-8">{t("auth.join_thousands")}</p>
          {/* <div className="flex justify-center gap-4 mb-8">
            <img
              src="/images/sedan.svg"
              alt={t('auth.sedan_alt')}
              width={76}
              height={76}
             
            />
            <img
              src="/images/suv.svg"
              alt={t('auth.suv_alt')}
             width={76}
             height={76}
  
            />
            <img
              src="/images/mini van.svg"
              alt={t('auth.hiace_alt')}
              width={76}
              height={76}
          
            />
          </div> */}
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            {/* <Image
              src="/images/logo.svg"
              alt={t('auth.logo_alt')}
              width={80}
              height={80}
              className="mx-auto mb-4"
            /> */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("auth.join_cab_center")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("auth.create_account_mobile")}
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("auth.create_account_desktop")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("auth.sign_up_subtitle")}
            </p>
          </div>

          {/* Alert */}
          {alert && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          {/* Signup Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute left-3 top-3 pointer-events-none z-10">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder={t("auth.first_name_placeholder")}
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors.firstName}
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-3 pointer-events-none z-10">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder={t("auth.last_name_placeholder")}
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors.lastName}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none z-10">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder={t("auth.email_placeholder")}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  error={errors.email}
                  className="pl-10"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none z-10">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder={t("auth.password_min_placeholder")}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  error={errors.password}
                  className="pl-10"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-buttons-gradient hover:bg-buttons-gradient-hover text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    {t("auth.creating_account")}
                  </div>
                ) : (
                  t("auth.create_account_button")
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                {t("auth.or")}
              </span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            {/* Google Signup */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("auth.continue_with_google")}
              </div>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <span className="text-gray-600 dark:text-gray-400">
              {t("auth.already_have_account")}{" "}
            </span>
            <Link
              href={ROUTES.LOGIN}
              className="text-[#00188F] hover:text-[#000729] font-semibold hover:underline transition-colors duration-200"
            >
              {t("auth.sign_in_link")}
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t("auth.terms_agreement_signup")}{" "}
              <Link href="#" className="text-[#00188F] hover:underline">
                {t("auth.terms_of_service")}
              </Link>{" "}
              {t("auth.and")}{" "}
              <Link href="#" className="text-[#00188F] hover:underline">
                {t("auth.privacy_policy")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
