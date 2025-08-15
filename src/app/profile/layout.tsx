import React from "react";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      {/* <MobileNavbar /> */}
      <main className="pt-20 pb-8">
        {children}
      </main>
    </div>
  );
}




