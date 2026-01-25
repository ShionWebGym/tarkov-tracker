import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Loot Lens",
  description: "Track your Escape from Tarkov item requirements for quests and hideout with Loot Lens.",
  openGraph: {
    title: "Loot Lens",
    description: "Track your Escape from Tarkov item requirements for quests and hideout with Loot Lens.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loot Lens",
    description: "Track your Escape from Tarkov item requirements for quests and hideout with Loot Lens.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <Providers>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
        </Providers>
      </body>
    </html>
  );
}
