"use client";

import { AuthLayout } from "../../components/layout/AuthLayout";
import VerifyResetOtp from "../../components/authentication/verifyResetOtp";
import { useTranslation } from "../../../lib/i18n";

export default function VerifyResetOtpPage() {
  const { t } = useTranslation();
  
  return (
    <AuthLayout
      title={t('auth.verify_reset_code_title')}
      subtitle={t('auth.verify_reset_code_subtitle')}
    >
      <VerifyResetOtp />
    </AuthLayout>
  );
}
