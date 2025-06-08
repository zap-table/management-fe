import { AppSidebar } from "@/components/layout/app-sidebar";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Providers } from "../providers/providers";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zap Table - Management",
  description: "ZapTable Software for restaurant management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <Providers>
          <AppSidebar />

          {children}
        </Providers>
      </body>
    </html>
  );
}
