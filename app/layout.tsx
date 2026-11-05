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
  ...(process.env.APP_URL ? { metadataBase: new URL(process.env.APP_URL) } : {}),
  title: "White Dental Clinic | Thoughtful Dental Care in Calgary, Alberta",
  description:
    "Discover thoughtful dental care, explore treatment options, and book a visit with White Dental Clinic in Calgary, Alberta.",
  openGraph: {
    type: "website",
    siteName: "White Dental Clinic",
    title: "White Dental Clinic | Thoughtful Dental Care in Calgary, Alberta",
    description: "Thoughtful dental care, clear answers, and a more comfortable visit at White Dental Clinic in Calgary, Alberta.",
  },
  twitter: {
    card: "summary",
    title: "White Dental Clinic | Thoughtful Dental Care in Calgary, Alberta",
    description: "Thoughtful dental care, clear answers, and a more comfortable visit at White Dental Clinic in Calgary, Alberta.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dentist",
              name: "White Dental Clinic",
              url: process.env.APP_URL,
              description:
                "Thoughtful dental care and appointment bookings in Calgary, Alberta.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "3840 104 Avenue NE",
                addressLocality: "Calgary",
                addressRegion: "Alberta",
                addressCountry: "CA",
              },
              areaServed: {
                "@type": "City",
                name: "Calgary",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
