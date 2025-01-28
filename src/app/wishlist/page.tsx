"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Trash } from "lucide-react";

const WishListPage = () => {
  const [wishlistItems, setWishlistItems] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    // API call to fetch product details
    const fetchIsPresentInWishlist = async () => {
      try {
        // Fetch product details
        const response = await axios.get(
          "https://ali-express-clone.onrender.com/api/wishlist/data",
          {
            headers: {
              Authorization: document.cookie,
            },
          }
        );
        const data = response.data?.wishlist;
        const checkItemId = response.data?.item?.proitemId;

        const wishlistItems = response.data?.wishlist;
        // console.log("cartItems : ", cartItems);
        const isPresent = wishlistItems.some(
          (item: any) => item.checkItemId == checkItemId
        );

        console.log("response : ", response);
        console.log("data : ", data);
        console.log("cartItems : ", checkItemId);

        setWishlistItems(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchIsPresentInWishlist();
  }, []);

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
      setWishlistItems(data);
    } catch (error) {
      console.log("ERROR : ", error);
    }
  };

  const handleProductInfo = (item: any) => {
    const id = Number(item.productId);
    router.push(`/products/${id}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex justify-center items-start gap-5 mt-10">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>
            Wish List ({wishlistItems ? wishlistItems.length : 0})
          </CardTitle>
          {wishlistItems && wishlistItems.length > 0 && (
            <CardDescription className="self-end hover:text-red-500 hover:font-bold transition-all duration-300">
              <button onClick={removeAllProducts} className="">
                Remove all products from wishlist
              </button>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-10 mt-10">
          {wishlistItems && wishlistItems.length > 0 ? (
            wishlistItems.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-8 mb-5">
                <div className="w-44 h-44 relative rounded-md flex-shrink-0">
                  <img
                    src={item.image}
                    alt="img"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <button
                    onClick={() => handleProductInfo(item)}
                    className="text-start"
                  >
                    <div className="line-clamp-2">{item.title}</div>
                  </button>

                  <div className="font-bold">₹ {item.price}</div>
                </div>
                <button className="bg-accent py-2 px-4 rounded-lg hover:font-bold transition-all duration-300">
                  Move to cart
                </button>
                <button className="py-2 px-2 rounded-lg">
                  <Trash className="w-6 h-6 hover:text-red-500 transition-all duration-300" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center gap-10">
              <ShoppingCart className="w-56 h-56 text-gray-300" />
              <div className="font-bold text-xl">
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
    </div>
  );
};

export default WishListPage;
