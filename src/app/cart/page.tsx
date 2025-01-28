"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Trash } from "lucide-react";
import { api } from "@/utils/index.api";

const CartPage = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [items, setItems] = useState<any>([]);
  const getUser = () => {
    const userCookie = Cookies.get("UserAuth");
    return userCookie ? JSON.parse(userCookie) : null;
  };
  const [user] = useState<any>(getUser);
  const isLocal = () => {
    const userCookie = Cookies.get("isLocal");
    return userCookie ? JSON.parse(userCookie) : null;
  };
  const [isLocalUser] = useState<any>(isLocal);
  const router = useRouter();



  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const data = await api.getCart(user.id);
        setItems(data);
      } catch (error) {
        console.log("ERROR:", error);
      }
    };

    fetchCartDetails();
  }, [user?.id]);

  useEffect(() => {
    let cost = 0;
    items.forEach((item: any) => {
      cost += Number(item.product.price) * item.quantity; // Use product price
    });
    setTotalCost(cost);
  }, [items]);


  const removeProductById = async (item: any) => {
    const id = item?.id; // Use product_id to remove
    try {
      await api.removeFromCart(id);
      setItems((prevItems:any) => prevItems.filter((i: any) => i.id !== id));
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const handleProductInfo = (item: any) => {
    const id = item?.id;
    router.push(`/products/${id}`);
  };

  return (
    <Suspense>
      <div className="w-full md:max-w-7xl md:mx-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-5 md:mt-10">
        <Card className="w-full max-w-5xl">
          <CardHeader>
            <CardTitle>Shopping Cart ({items.length})</CardTitle>
            {/* {items.length > 0 && (
              <CardDescription className="self-end hover:text-red-500">
                <button onClick={removeAllProducts}>
                  Remove All Products
                </button>
              </CardDescription>
            )} */}
          </CardHeader>
          <CardContent className="flex flex-col gap-10 mt-10">
            {items.length > 0 ? (
              items.map((item: any, index: number) => (
                <div key={item.id} className="flex items-center md:items-start gap-8 mb-5">
                  <div className="flex flex-col gap-2 md:gap-4 flex-1">
                    <button onClick={() => handleProductInfo(item)} className="text-start">
                      <div className="line-clamp-1 md:line-clamp-2">{item.product.name}</div>
                    </button>
                    <div className="font-bold">{isLocalUser ?`${ item.product.price * 127}br`: `$${item.product.price}`}</div>
                    <div className="flex flex-col gap-2">
                      <div>Quantity: {item.quantity}</div>
                      <div>Size: {item.size}</div>
                      <div>Color: {item.color}</div>
                    </div>
                  </div>
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

        {items.length > 0 ? (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-10 mt-10">
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>{isLocalUser ?`${ totalCost * 127}br`: `$${totalCost}`}</div>
              </div>
              <Link href="/CheckoutPage" className="w-full px-5 py-3 text-center rounded-3xl bg-red-500 text-white font-bold hover:font-extrabold transition-all duration-300">
                Checkout ({items.length})
              </Link>
            </CardContent>
          </Card>
        ):<div></div>}
      </div>
    </Suspense>
  );
};

export default CartPage;
