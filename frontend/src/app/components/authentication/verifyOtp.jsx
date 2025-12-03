"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Alert, Spinner } from "../ui";
import { ROUTES } from "../../lib/constants";
import { useTranslation } from "../../../lib/i18n";

export default function VerifyOtp() {
  const { t, isInitialized } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOTP, resendOTP } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setError("");

    if (!otp.trim()) {
      setError(t('errors.otp_required'));
      return;
    }

    if (otp.length !== 4) {
      setError(t('errors.otp_four_digits'));
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        setAlert({
          type: "success",
          message: t('success.email_verified'),
        });
        setTimeout(() => {
          window.location.href = ROUTES.DASHBOARD;
        }, 1500);
      } else {
        setAlert({ type: "error", message: result.message || t('errors.invalid_otp') });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || t('errors.verification_failed'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setAlert(null);
    setResending(true);

    try {
      const result = await resendOTP(email);

      if (result.success) {
        setAlert({ type: "success", message: t('success.otp_sent') });
        setCountdown(60); // Start 60 second countdown
      } else {
        setAlert({
          type: "error",
          message: result.message || t('errors.resend_otp_failed'),
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || t('errors.resend_otp_failed'),
      });
    } finally {
      setResending(false);
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
          {t('auth.verification_code_sent')} <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder={t('auth.enter_otp_placeholder')}
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 4);
            setOtp(value);
            if (error) setError("");
          }}
          error={error}
          disabled={loading}
          maxLength={4}
          className="text-center text-2xl tracking-widest"
        />

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? <Spinner size="sm" className="mx-auto" /> : t('auth.verify_email')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {t('auth.didnt_receive_code')}
        </p>
        <button
          onClick={handleResendOTP}
          disabled={resending || countdown > 0}
          className="text-sm text-[#0079D3] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending
            ? t('auth.sending')
            : countdown > 0
            ? t('auth.resend_in_seconds', { seconds: countdown })
            : t('auth.resend_otp')}
        </button>
      </div>
    </div>
  );
}
