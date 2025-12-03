"use client";

import { Shield, Clock, CreditCard, MapPin, Car, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';

export default function FeaturesSection() {
  const { t } = useTranslation();
  const features = [
    {
      icon: Shield,
      title: t('feature_section.reliable_service_title'),
      description: t('feature_section.reliable_service_desc')
    },
    {
      icon: CreditCard,
      title: t('feature_section.transparent_pricing_title'), 
      description: t('feature_section.transparent_pricing_desc')
    },
    {
      icon: Clock,
      title: t('feature_section.available_24_7_title'),
      description: t('feature_section.available_24_7_desc')
    }
  ];

  const steps = [
    {
      number: "01",
      icon: MapPin,
      title: t('feature_section.enter_pickup_title'),
      description: t('feature_section.enter_pickup_desc')
    },
    {
      number: "02", 
      icon: Car,
      title: t('feature_section.choose_ride_title'),
      description: t('feature_section.choose_ride_desc')
    },
    {
      number: "03",
      icon: CheckCircle,
      title: t('feature_section.confirm_enjoy_title'),
      description: t('feature_section.confirm_enjoy_desc')
    }
  ];

  return (
    <div className="bg-white">
      {/* Features Section */}
      <section id="features" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              {t('feature_section.why_ride_with_us')}
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-ui-cards-gradient rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="inline-flex p-4 rounded-2xl bg-white mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-accent leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Steps Section */}
      <section id="steps" className="py-16 lg:py-20 bg-ui-cards-gradient relative">
        {/* Curved Top Border */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16 lg:h-24"
          >
            <path
              d="M0,120 C150,20 350,120 600,70 C850,20 1050,120 1200,70 L1200,0 L0,0 Z"
              fill="white"
            ></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('feature_section.journey_steps')}
            </h2>
          </div>

          {/* Timeline Container */}
          <div className="relative max-w-7xl mx-auto">
            {/* Timeline Line - Hidden on mobile, visible on larger screens */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-white/30 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent h-full"></div>
            </div>

            {/* Timeline Steps */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start space-y-12 md:space-y-0 md:space-x-8 lg:space-x-16">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center max-w-xs md:max-w-sm lg:max-w-md relative group flex-1">
                  {/* Timeline Dot */}
                  <div className="relative mb-6">
                    {/* Outer Ring */}
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                      {/* Inner Circle with Number */}
                      <div className="w-14 h-14 bg-ui-cards-gradient rounded-full flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                        {step.number}
                      </div>
                    </div>
                  
                  </div>

                  {/* Content Card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Mobile Timeline Connector */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden w-1 h-12 bg-white/30 mt-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent w-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -bottom-4 right-1/4 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute top-1/2 left-8 w-1 h-1 bg-white rounded-full opacity-50 animate-ping"></div>
          </div>
        </div>
      </section>
    </div>
  );
}