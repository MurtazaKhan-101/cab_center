"use client";

import { AuthLayout } from "../../components/layout/AuthLayout";
import ResetPassword from "../../components/authentication/resetPassword";
import { useTranslation } from "../../../lib/i18n";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  
  return (
    <AuthLayout
      title={t('auth.create_new_password_title')}
      subtitle={t('auth.create_new_password_subtitle')}
    >
      <ResetPassword />
    </AuthLayout>
  );
}
