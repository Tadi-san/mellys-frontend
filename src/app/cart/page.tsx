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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  setAuthState,
  selectAuthState,
} from "@/lib/store/features/auth/authSlice";

const CartPage = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [items, setItems] = useState<any>();

  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) =>
    selectAuthState(state)
  );

  const router = useRouter();

  // Check wheater user is logged in or not
  useEffect(() => {
    const token = Cookies.get("UserAuth");
    dispatch(setAuthState(!!token)); // Update Redux state based on cookie presence
  }, [dispatch]);

  // get all products from cart-database and add them to state
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await axios.get(
          "https://ali-express-clone.onrender.com/api/cart/data",
          {
            headers: {
              Authorization: document.cookie,
            },
          }
        );
        const data = response.data?.cart;
        setItems(data);
      } catch (error) {
        console.log("ERROR : ", error);
      }
    };

    fetchCartDetails();
  }, []);

  // update total cost after adding products to state
  useEffect(() => {
    let cost = 0;
    if (items) {
      items.forEach((item: any) => {
        cost += Number(item.price) * item.quantity;
      });
    }
    setTotalCost(cost);
    console.log("cart items : ", items);
  }, [items, totalCost]);

  const removeAllProducts = async () => {
    try {
      const response = await axios.delete(
        `https://ali-express-clone.onrender.com/api/cart/removeall`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: document.cookie,
          },
        }
      );

      console.log("ALL PRODUCTS REMOVED SUCCESSFULLY");

      const data = response.data?.cart;
      setItems(data);
    } catch (error) {
      console.log("ERROR : ", error);
    }
  };

  // dispatch(removeCartItem(id));
  const removeProductById = async (item: any) => {
    const id = Number(item.productId);
    try {
      const response = await axios.delete(
        `https://ali-express-clone.onrender.com/api/cart/removeone/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: document.cookie,
          },
        }
      );

      console.log("REMOVED SUCCESSFULLY");

      const data = response.data?.cart;
      setItems(data);
    } catch (error) {
      console.log("ERROR : ", error);
    }
  };

  const handleProductInfo = (item: any) => {
    const id = Number(item.productId);
    router.push(`/products/${id}`);
  };

  return (
    <Suspense>
      <div className="w-full md:max-w-7xl md:mx-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-5 md:mt-10">
        <Card className="w-full max-w-5xl">
          <CardHeader>
            <CardTitle>Shopping Cart ({items ? items.length : 0})</CardTitle>
            {items && items.length > 0 && (
              <CardDescription className="self-end hover:text-red-500">
                <button onClick={removeAllProducts} className="">
                  Remove All Products
                </button>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-10 mt-10">
            {items && items.length > 0 ? (
              items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center md:items-start gap-8 mb-5"
                >
                  <div className="w-20 md:w-44 h-20 md:h-44 relative rounded-md flex-shrink-0">
                    <img
                      src={item.image}
                      alt="img"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:gap-4 flex-1">
                    <button
                      onClick={() => handleProductInfo(item)}
                      className="text-start"
                    >
                      <div className="line-clamp-1 md:line-clamp-2">
                        {item.title}
                      </div>
                    </button>

                    <div className="font-bold">₹ {item.price.toFixed(2)}</div>

                    <div className="flex flex-col gap-2">
                      <div> Quantity: {item.quantity}</div>
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
                <Link
                  href="/"
                  className="px-5 py-3  rounded-3xl bg-red-500 text-white hover:scale-105 hover:bg-red-600 hover:font-bold transition-all duration-300"
                >
                  Explore More Items
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SUMMARY / TOTAL-COST */}
        {items && items.length > 0 ? (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-10 mt-10">
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>₹ {totalCost.toFixed(2)}</div>
              </div>
              <button className="w-full px-5 py-3 rounded-3xl bg-red-500 text-white font-bold hover:font-extrabold transition-all duration-300">
                Checkout ({items ? items.length : 0})
              </button>
            </CardContent>
          </Card>
        ) : (
          <div></div>
        )}
      </div>
    </Suspense>
  );
};

export default CartPage;
