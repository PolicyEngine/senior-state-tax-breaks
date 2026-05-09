import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyEngine | Senior State Tax Breaks",
  description:
    "Interactive U.S. map of senior-focused state tax breaks modeled in PolicyEngine US for 2026, styled with PolicyEngine design tokens.",
  icons: {
    icon: "/assets/logos/policyengine/teal-square.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
