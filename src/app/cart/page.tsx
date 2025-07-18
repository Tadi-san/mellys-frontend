"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Trash } from "lucide-react";
import { api } from "@/utils/index.api";
<<<<<<< HEAD
import { toast } from "@/components/ui/use-toast";
=======
import Image from "next/image";
import LoginModal from "@/components/auth/LoginModal";
import { getUser, isAuthenticated } from "@/utils/auth";
>>>>>>> b3e788d4a56a5a0648b610c1b5b7a463f3d87a1c

const CartPage = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [items, setItems] = useState<any[]>([]); // Initialize as an empty array
  const [user, setUser] = useState<any>(getUser());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLocal = () => {
    const userCookie = Cookies.get("isLocal");
    return userCookie ? JSON.parse(userCookie) : null;
  };
  const [isLocalUser] = useState<any>(isLocal);
  const router = useRouter();

<<<<<<< HEAD


// In your useEffect for fetching cart:
useEffect(() => {
  const fetchCartDetails = async () => {
    try {
      const user = getUser(); // Get fresh user data
      const data = await api.getCart(user?.id || null);
      setItems(data.cart || []);
    } catch (error) {
      console.log("ERROR:", error);
    }
  };
=======
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const data = await api.getCart(user?.id);
        setItems(data); // Set the items directly from the API response
      } catch (error) {
        console.log("ERROR:", error);
      }
    };
>>>>>>> b3e788d4a56a5a0648b610c1b5b7a463f3d87a1c

  fetchCartDetails();
}, []); // Remove user.id from dependencies

// In your removeProductById function:
const removeProductById = async (item: any) => {
  const id = item?.id;
  const user = getUser(); // Get fresh user data
  try {
    await api.removeFromCart(user?.id || null, id);
    setItems((prevItems: any) => prevItems.filter((i: any) => i.id !== id));
    toast({ title: "Success", description: "Item removed from cart!" });
  } catch (error) {
    console.log("ERROR:", error);
    toast({ title: "Error", description: "Failed to remove item from cart." });
  }
};

  useEffect(() => {
    let cost = 0;
    items.forEach((item: any) => {
      cost += Number(item.product.price) * item.quantity; // Access product price from nested product object
    });
    setTotalCost(cost);
  }, [items]);

<<<<<<< HEAD

  // const removeProductById = async (item: any) => {
  //   const id = item?.id; // Use product_id to remove
  //   try {
  //     await api.removeFromCart(id);
  //     setItems((prevItems:any) => prevItems.filter((i: any) => i.id !== id));
  //   } catch (error) {
  //     console.log("ERROR:", error);
  //   }
  // };
=======
  const removeProductById = async (item: any) => {
    const id = item?.id; // Use the cart item ID to remove
    try {
      await api.removeFromCart(id);
      setItems((prevItems: any[]) => prevItems.filter((i: any) => i.id !== id));
    } catch (error) {
      console.log("ERROR:", error);
    }
  };
>>>>>>> b3e788d4a56a5a0648b610c1b5b7a463f3d87a1c

  const handleProductInfo = (item: any) => {
    const id = item?.product.id; // Use the product ID for navigation
    router.push(`/products/${id}`);
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
    } else {
      router.push("/CheckoutPage");
    }
  };

  const handleLoginSuccess = () => {
    setUser(getUser());
    router.push("/CheckoutPage");
  };
  return (
    <Suspense>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      <div className="w-full md:max-w-7xl md:mx-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-5 md:mt-10">
        <Card className="w-full max-w-5xl">
          <CardHeader>
            <CardTitle>Shopping Cart ({items.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-10 mt-10">
            {items.length > 0 ? (
              items.map((item: any, index: number) => (
                <div key={item.id} className="flex items-center md:items-start gap-8 mb-5">
                  {/* Product Image */}
                  {item.product.images && item.product.images.length > 0 && (
                    <div className="w-24 h-24 flex-shrink-0 relative">
                       <Image
    src={item.product.images[0].image_url}
    alt={item.product.name}
    fill
    className="object-cover rounded-lg"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex flex-col gap-2 md:gap-4 flex-1">
                    <button onClick={() => handleProductInfo(item)} className="text-start">
                      <div className="line-clamp-1 md:line-clamp-2">{item.product.name}</div>
                    </button>
                    <div className="font-bold">
                      {isLocalUser ? `${item.product.price * 127} br` : `$${item.product.price}`}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>Quantity: {item.quantity}</div>
                      <div>Size: {item.size}</div>
                      <div>Color: {item.color}</div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button onClick={() => removeProductById(item)}>
                    <Trash className="w-5 md:w-6 h-5 md:h-6 hover:text-red-500" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center gap-10">
                <ShoppingCart className="w-56 h-56 text-gray-300" />
                <div className="font-bold text-xl text-center">
                  No items yet? Continue shopping to explore more.
                </div>
                <Link href="/" className="px-5 py-3 rounded-3xl bg-red-500 text-white hover:scale-105 hover:bg-red-600 hover:font-bold transition-all duration-300">
                  Explore More Items
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {items.length > 0 && (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-10 mt-10">
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>{isLocalUser ? `${totalCost * 127} br` : `$${totalCost}`}</div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full px-5 py-3 text-center rounded-3xl bg-red-500 text-white font-bold hover:font-extrabold transition-all duration-300"
              >
                Checkout ({items.length})
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </Suspense>
  );
};

export default CartPage;