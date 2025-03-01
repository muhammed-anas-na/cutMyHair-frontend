import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Salon",
  description: "Next Gen Salon Experience",
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
