import type { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import FloatingWhatsapp from '@/components/floating-whatsapp';
import './globals.css';
import { Inter } from 'next/font/google';
import { PaymentSecurityNotice } from '@/components/payment-security-notice';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const APP_NAME = "Nityholiday";
const APP_DESCRIPTION = "Explore the world with Nityholiday. We offer personalized tour packages, verified services, and competitive pricing for an unforgettable travel experience.";
const APP_URL = "https://nityholiday.com"; // Replace with your actual domain

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [{
      url: `${APP_URL}/og-image.jpg`, // Replace with your actual OG image URL
      width: 1200,
      height: 630,
      alt: "Nityholiday - Your Gateway to Unforgettable Journeys",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.jpg`], // Replace with your actual OG image URL
  },
};

export const viewport: Viewport = {
  themeColor: '#013220',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <FloatingWhatsapp />
        <Toaster />
        <PaymentSecurityNotice />
      </body>
    </html>
  );
}
