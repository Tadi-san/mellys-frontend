// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Melly&apos;s Fashion</h1>
      {/* OR */}
      <h1>{"Welcome to Melly's Fashion"}</h1>
      <Link href="/products/[id]" as={`/products/${123}`}>
        {"Go to Dynamic Page"}
      </Link>
    </div>
  );
}