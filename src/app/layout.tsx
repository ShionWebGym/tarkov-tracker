import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lootlens.com"),
  title: "Loot Lens - Escape from Tarkov Item Tracker | タルコフ 必要アイテム管理",
  description: "Track your Escape from Tarkov item requirements for tasks and hideout. タルコフのタスクやハイドアウトに必要なアイテム数（必要数）を管理・追跡できるツールです。",
  keywords: ["Escape from Tarkov", "Tarkov Tracker", "Loot Lens", "タルコフ", "アイテム", "必要数", "タスク", "ハイドアウト", "管理", "EFT"],
  openGraph: {
    title: "Loot Lens - Escape from Tarkov Item Tracker | タルコフ 必要アイテム管理",
    description: "Track your Escape from Tarkov item requirements for tasks and hideout. タルコフのタスクやハイドアウトに必要なアイテム数（必要数）を管理・追跡できるツールです。",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Loot Lens Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loot Lens - Escape from Tarkov Item Tracker | タルコフ 必要アイテム管理",
    description: "Track your Escape from Tarkov item requirements for tasks and hideout. タルコフのタスクやハイドアウトに必要なアイテム数（必要数）を管理・追跡できるツールです。",
    images: ["/api/og"],
  },
  verification: {
    google: "024AEIsaKUndRijzqUHr3GBpMSSpdhQOpZmRaT-1XJg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Loot Lens",
    "url": "https://lootlens.com",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Any",
    "description": "Track your Escape from Tarkov item requirements for tasks and hideout. タルコフのタスクやハイドアウトに必要なアイテム数（必要数）を管理・追跡できるツールです。",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "keywords": "Escape from Tarkov, Tarkov Tracker, Loot Lens, タルコフ, アイテム, 必要数"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <Providers>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
