import type { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import FloatingWhatsapp from '@/components/floating-whatsapp';
import './globals.css';

const APP_NAME = "NityHoliday Adventures";
const APP_DESCRIPTION = "Explore the world with NityHoliday Adventures. We offer personalized tour packages, verified services, and competitive pricing for an unforgettable travel experience.";
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
      alt: "NityHoliday Adventures - Your Gateway to Unforgettable Journeys",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
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
      </body>
    </html>
  );
}
