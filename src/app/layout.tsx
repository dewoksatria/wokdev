import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dewa Ketut Satriawan - Portfolio",
    template: "%s | Dewa Ketut Satriawan - Portfolio"
  },
  description: "Professional portfolio showcasing my work and experience",
  keywords: ["portfolio", "developer", "projects"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Your Portfolio",
    title: "Your Portfolio",
    description: "Professional portfolio showcasing my work and experience",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Portfolio",
    description: "Professional portfolio showcasing my work and experience",
    images: ["/og-image.jpg"],
    creator: "@yourtwitter"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
