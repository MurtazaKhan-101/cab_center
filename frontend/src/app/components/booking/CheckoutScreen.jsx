"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Car,
  CreditCard,
  Banknote,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Button, Spinner } from "../ui";
import Image from "next/image";
import { useTranslation } from "../../../lib/i18n";
import { createBooking } from "../../lib/booking";

export default function CheckoutScreen({
  bookingData,
  vehicleInfo,
  calculatedFare,
  onBack,
  onBookingSuccess,
}) {
  const { t, isRTL } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const paymentMethods = [
    {
      id: "cash",
      name: t("checkout.payment_cash"),
      icon: Banknote,
      description: t("checkout.payment_cash_desc"),
    },
    {
      id: "card",
      name: t("checkout.payment_card"),
      icon: CreditCard,
      description: t("checkout.payment_card_desc"),
    },
  ];

  const handlePaymentSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setError(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedPaymentMethod) {
      setError(t("checkout.payment_method_required"));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare booking data for API with payment method
      const finalBookingData = {
        ...bookingData,
        payment_method: selectedPaymentMethod,
      };

      const response = await createBooking(finalBookingData);

      if (response.success) {
        onBookingSuccess(response);
      } else {
        setError(response.message || t("messages.booking_failed"));
      }
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.message || t("messages.booking_failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 ${
        isRTL() ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("common.back")}
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t("checkout.title")}
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 flex-1">
          {/* Left Side - Booking Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("checkout.booking_summary")}
            </h2>

            <div className="space-y-4">
              {/* Trip Details */}
              <div className="border-b dark:border-gray-700 pb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t("checkout.trip_details")}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("booking_form.from_label")}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {bookingData.pickup}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("booking_form.to_label")}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {bookingData.drop}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-auth-btn-bg" />
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("booking_form.date_label")}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(bookingData.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("booking_form.time_label")}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {bookingData.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 text-auth-btn-bg flex items-center justify-center">
                      <span className="text-xs font-bold">KM</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("booking_form.distance_label")}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {bookingData.distance_km} {t("common.km")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="border-b dark:border-gray-700 pb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t("checkout.passenger_details")}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-auth-btn-bg" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("booking_form.passenger_name_label")}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {bookingData.user_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-auth-btn-bg" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("booking_form.passengers_label")}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {bookingData.no_of_passengers} {t("common.passengers")}
                      </p>
                    </div>
                  </div>
                  {bookingData.special_requirements && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-auth-btn-bg mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("booking_form.special_req_label")}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {bookingData.special_requirements}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="border-b dark:border-gray-700 pb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t("checkout.vehicle_details")}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={vehicleInfo.image}
                      alt={vehicleInfo.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                    <div className="absolute -top-1 -right-1 bg-auth-btn-bg text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {vehicleInfo.seats}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {vehicleInfo.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {vehicleInfo.capacity}
                    </p>
                    <p className="text-xs text-auth-btn-bg">
                      {vehicleInfo.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t("checkout.fare_breakdown")}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("checkout.base_fare")}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {calculatedFare} {t("common.currency_sar")}
                    </span>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900 dark:text-white">
                        {t("checkout.total_fare")}
                      </span>
                      <span className="text-lg font-bold text-auth-btn-bg">
                        {calculatedFare} {t("common.currency_sar")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("checkout.payment_method")}
            </h2>

            {/* Payment Methods */}
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentSelect(method.id)}
                    className={`cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? "border-auth-btn-bg bg-auth-btn-bg/5"
                        : "border-gray-200 dark:border-gray-600 hover:border-auth-btn-bg/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? "border-auth-btn-bg bg-auth-btn-bg"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedPaymentMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <IconComponent
                        className={`w-5 h-5 ${
                          selectedPaymentMethod === method.id
                            ? "text-auth-btn-bg"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            selectedPaymentMethod === method.id
                              ? "text-auth-btn-bg"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {method.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Confirm Booking Button */}
            <Button
              onClick={handleConfirmBooking}
              disabled={submitting || !selectedPaymentMethod}
              className="w-full bg-buttons-gradient hover:bg-buttons-gradient-hover text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  {t("checkout.processing")}
                </span>
              ) : (
                t("checkout.confirm_booking")
              )}
            </Button>

            {/* Payment Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {t("checkout.payment_info")}{" "}
                <ShieldCheck className="inline w-4 h-4 ml-1 mb-0.5 text-blue-600 dark:text-blue-400" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
