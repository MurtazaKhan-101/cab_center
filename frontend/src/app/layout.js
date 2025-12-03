"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "../lib/i18n";
import LayoutWrapper from "./components/layout/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>Cab Centre - Your Ride, Your Way</title>
        <meta name="description" content="Premium cab booking service" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedLang = localStorage.getItem('language') || 'ar';
                document.documentElement.lang = savedLang;
                document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
              })();
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
