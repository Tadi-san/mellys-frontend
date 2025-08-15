"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Trash, Plus, Minus } from "lucide-react";
import { api } from "@/utils/index.api";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated, setUser } from "@/utils/auth";
import LoginModal from "@/components/auth/LoginModal";

const CartPage = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [items, setItems] = useState<any[]>([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false);
  const getUser = () => {
    const userCookie = Cookies.get("UserAuth");
    return userCookie ? JSON.parse(userCookie) : null;
  };
  const [user] = useState<any>(getUser);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLocal = () => {
    const userCookie = Cookies.get("isLocal");
    return userCookie ? JSON.parse(userCookie) : null;
  };
  const router = useRouter();

  const fetchCartDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = getUser(); // Get fresh user data
      console.log("Cart page - getUser() result:", user);
      console.log("Cart page - user ID:", user?.id);
      const data = await api.getCart(user?.id || null);
      console.log("Cart page - getCart result:", data);
      setItems(data.cart || []);
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

// In your useEffect for fetching cart:
useEffect(() => {
  fetchCartDetails();
}, [fetchCartDetails]);

// In your removeProductById function:
const removeProductById = async (item: any) => {
  const id = item?.id;
  const user = getUser(); // Get fresh user data
  try {
    await api.removeFromCart(user?.id || null, id);
    // Refresh cart data instead of just filtering
    await fetchCartDetails();
    toast({ title: "Success", description: "Item removed from cart!" });
  } catch (error) {
    console.log("ERROR:", error);
    toast({ title: "Error", description: "Failed to remove item from cart." });
  }
};

const updateItemQuantity = async (item: any, newQuantity: number) => {
  if (newQuantity < 1) return;
  
  const user = getUser();
  try {
    await api.updateCart(user?.id || null, item.id, newQuantity);
    // Refresh cart data to ensure consistency
    await fetchCartDetails();
    toast({ title: "Success", description: "Quantity updated!" });
  } catch (error) {
    console.log("ERROR:", error);
    toast({ title: "Error", description: "Failed to update quantity." });
  }
};

  useEffect(() => {
    let cost = 0;
    items.forEach((item: any) => {
      cost += Number(item.product.price) * item.quantity; // Access product price from nested product object
    });
    setTotalCost(cost);
  }, [items]);

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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading cart...</p>
              </div>
            ) : items.length > 0 ? (
              items.map((item: any, index: number) => (
                <div key={item.id} className="flex items-center md:items-start gap-8 mb-5">
                  {/* Product Image */}
                  {item.product.images && item.product.images.length > 0 && (
                    <div className="w-24 h-24 flex-shrink-0 relative">
                       <img
    src={item.product.images[0].image_url}
    alt={item.product.name}
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
                      { `${item.product.price } birr`}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span>Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItemQuantity(item, item.quantity - 1)}
                            className="bg-gray-100 rounded-full p-1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item, item.quantity + 1)}
                            className="bg-gray-100 rounded-full p-1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
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
                <div>{totalCost} birr</div>
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