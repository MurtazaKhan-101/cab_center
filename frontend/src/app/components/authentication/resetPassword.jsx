"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Alert, Spinner } from "../ui";
import { ROUTES } from "../../lib/constants";
import { useTranslation } from "../../../lib/i18n";

export default function ResetPassword() {
  const { t, isInitialized } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
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

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const otpParam = searchParams.get("otp");

    if (emailParam && otpParam) {
      setEmail(emailParam);
      setOtp(otpParam);
    } else {
      router.push(ROUTES.FORGOT_PASSWORD);
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = t('errors.password_required');
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t('errors.password_min_length');
    } else if (/\s/.test(formData.newPassword)) {
      newErrors.newPassword = t('errors.password_no_spaces');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.confirm_password_required');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwords_no_match');
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
      const result = await resetPassword(email, otp, formData.newPassword);

      if (result.success) {
        setAlert({
          type: "success",
          message: t('success.password_reset_success'),
        });
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message: result.message || t('errors.password_reset_failed'),
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || t('errors.generic_error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('auth.create_new_password_for')} <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          name="newPassword"
          placeholder={t('auth.new_password_placeholder')}
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          disabled={loading}
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder={t('auth.confirm_password_placeholder')}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={loading}
        />

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>{t('auth.password_requirements')}:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>{t('auth.password_min_characters')}</li>
            <li>{t('auth.password_no_spaces')}</li>
          </ul>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? (
            <Spinner size="sm" className="mx-auto" />
          ) : (
            t('auth.reset_password_button')
          )}
        </Button>
      </form>
    </div>
  );
}
