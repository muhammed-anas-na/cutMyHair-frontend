import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cut My Hair | Next Gen Salon Experience",
  description: "Book salon appointments, haircuts, styling, and beauty services near you. Find top-rated salons with real customer reviews.",
  keywords: "salon booking, haircut, beauty services, salon near me, hair , coloring, hair coloring, facials, salon",
  metadataBase: new URL("https://cutmyhair.in"),
  openGraph: {
    title: "Cut My Hair | Next Gen Salon Experience",
    description: "Book salon appointments, haircuts, styling, and beauty services near you.",
    url: "https://cutmyhair.in",
    siteName: "Cut My Hair",
    images: [
      {
        url: "/white-logo.png",
        width: 1200,
        height: 630,
        alt: "Cut My Hair - Salon Booking Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://cutmyhair.in",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <LocationProvider>
          <body className={`${inter.variable} antialiased`}>{children}</body>
        </LocationProvider>
      </AuthProvider>
    </html>
  );
}
