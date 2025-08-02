import dynamic from "next/dynamic";
import { Metadata } from "next";
import "../globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

// const MobileNavbar = dynamic(() => import("@/components/MobileNavbar"), {
//   ssr: false, // Disable server-side rendering for this component
// });

export const metadata: Metadata = {
  title: "Mellys Fashion",
  description: "Affordable Prices And Top Designs ",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToastProvider>
        {/* <MobileNavbar /> */}
        {children}
        <Toaster />
      </ToastProvider>
    </>
  );
}