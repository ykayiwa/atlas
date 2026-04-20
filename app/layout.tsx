import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/shared/ServiceWorker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Atlas AI — The Ministerial Intelligence Engine",
  description:
    "The 24/7 investor engagement platform of the Office of the Hon. State Minister of Finance for Investment and Privatization, Republic of Uganda. Policy-grounded answers on tax incentives, the PERD Act, bilateral treaties, and Uganda's privatization portfolio.",
  keywords: [
    "Uganda",
    "investment",
    "privatization",
    "Ministry of Finance",
    "PERD Act",
    "Uganda Investment Authority",
    "tax incentives",
    "Special Economic Zones",
    "bilateral investment treaties",
    "Atlas AI",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Atlas AI",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Uganda tricolor — national mark */}
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
          <div className="h-full w-full bg-gradient-to-r from-[#000000] via-[#FCDC04] to-[#D90000]" />
        </div>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
