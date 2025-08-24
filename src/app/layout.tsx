import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import HydrationSuppressor from "@/components/HydrationSuppressor";
import HydrationScript from "@/components/HydrationScript";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Levy's Fitness - אימון אישי ושינוי חיים",
  description: "שנה את חייך עם אימון כושר מותאם אישית. מתמחה בירידה במשקל, בניית שרירים ואימונים בטוחים להריון. הזמן ייעוץ חינם היום!",
  keywords: ["מאמן אישי", "כושר", "ירידה במשקל", "בניית שרירים", "כושר בהריון", "שינוי חיים"],
  authors: [{ name: "Levy's Fitness" }],
  creator: "Levy's Fitness",
  publisher: "Levy's Fitness",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/Logo.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://levysfitness.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Levy's Fitness - אימון אישי ושינוי חיים",
    description: "שנה את חייך עם אימון כושר מותאם אישית. מתמחה בירידה במשקל, בניית שרירים ואימונים בטוחים להריון.",
    url: "https://levysfitness.com",
    siteName: "Levy's Fitness",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Levy's Fitness - אימון אישי",
      },
    ],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Levy's Fitness - אימון אישי ושינוי חיים",
    description: "שנה את חייך עם אימון כושר מותאם אישית. מתמחה בירידה במשקל, בניית שרירים ואימונים בטוחים להריון.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${inter.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/Logo.png" />
        <HydrationScript />
      </head>
      <body className="antialiased">
        <HydrationSuppressor />
        {children}
      </body>
    </html>
  );
}
