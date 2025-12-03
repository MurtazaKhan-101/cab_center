"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Alert, Spinner } from "../ui";
import { ROUTES } from "../../lib/constants";
import { useTranslation } from "../../../lib/i18n";
import Link from "next/link";

export default function ForgetPassword() {
  const { t, isInitialized } = useTranslation();
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
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

  const validateEmail = () => {
    if (!email.trim()) {
      setError(t('errors.email_required'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('errors.email_invalid'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setError("");

    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setAlert({ type: "success", message: t('success.reset_code_sent') });
        setTimeout(() => {
          window.location.href = `${
            ROUTES.VERIFY_RESET_OTP
          }?email=${encodeURIComponent(email)}`;
        }, 1500);
      } else {
        setAlert({
          type: "error",
          message: result.message || t('errors.reset_code_failed'),
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
          {t('auth.forgot_password_description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder={t('auth.email_placeholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
          disabled={loading}
        />

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? (
            <Spinner size="sm" className="mx-auto" />
          ) : (
            t('auth.send_reset_code')
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href={ROUTES.LOGIN}
          className="text-sm text-[#0079D3] hover:underline"
        >
          {t('auth.back_to_login')}
        </Link>
      </div>
    </div>
  );
}
