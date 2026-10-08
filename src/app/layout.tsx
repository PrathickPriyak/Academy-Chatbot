import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl(),
    title: siteName,
    description: siteDescription,
    siteName,
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Infozub Digital Academy",
              url: siteUrl(),
              description: siteDescription,
            }),
          }}
        />
      </body>
    </html>
  );
}
