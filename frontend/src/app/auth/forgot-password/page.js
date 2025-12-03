"use client";

import { AuthLayout } from "../../components/layout/AuthLayout";
import ForgetPassword from "../../components/authentication/forgetPassword";
import { useTranslation } from "../../../lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  
  return (
    <AuthLayout
      title={t('auth.forgot_password_title')}
      subtitle={t('auth.forgot_password_page_subtitle')}
    >
      <ForgetPassword />
    </AuthLayout>
  );
}
