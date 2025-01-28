import "../globals.css"; // Ensure the file path is correct
import StoreProvider from "../StoreProvider";

export const metadata = {
  title: "Mellys fashion",
  description: "cart data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Ensure the <body> tag is directly wrapping the content */}
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
