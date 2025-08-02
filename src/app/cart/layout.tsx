import "../globals.css"; // Ensure the file path is correct
import StoreProvider from "../StoreProvider";

export const metadata = {
  title: "Mellys fashion",
  description: "cart data",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreProvider>{children}</StoreProvider>
    </>
  );
}
