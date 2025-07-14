import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileNavbar from "@/components/MobileNavbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mellys Fashion",
  description: "Affordable Prices And Top Designs ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <MobileNavbar />
          {children}
          <Toaster />
      </body>
    </html>
  );
}
