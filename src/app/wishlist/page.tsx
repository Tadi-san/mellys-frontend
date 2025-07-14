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
import { api } from "@/utils/index.api";
import Cookies from "js-cookie"; 
<<<<<<< HEAD
import { toast } from "@/components/ui/use-toast";
=======
import Image from "next/image";
>>>>>>> b3e788d4a56a5a0648b610c1b5b7a463f3d87a1c
const WishListPage = () => {
  const [wishlistItems, setWishlistItems] = useState<any>();
  const getUser = () => {
    const userCookie = Cookies.get("UserAuth");
    return userCookie ? JSON.parse(userCookie) : null;
  };
  const [user] = useState<any>(getUser);

  const router = useRouter();
  // const getUser = () => {
  //   const userCookie = Cookies.get("UserAuth");
  //   return userCookie ? JSON.parse(userCookie) : null;
  // };
  // const [user] = useState<any>(getUser); 

  // useEffect(() => {
  //   // API call to fetch product details
  //   const fetchIsPresentInWishlist = async () => {
  //     try {
  //       // Fetch product details
  //       const response = api.getWishlist(user.id);
  //       const wishlistItems = response;
  //       // console.log("cartItems : ", cartItems);
  //       const isPresent = wishlistItems.some(
  //         (item: any) => item.checkItemId == checkItemId
  //       );

  //       console.log("response : ", response);
  //       console.log("data : ", data);
  //       console.log("cartItems : ", checkItemId);

  //       setWishlistItems(data);
  //     } catch (error) {
  //       console.error("Error fetching data", error);
  //     }
  //   };

  //   fetchIsPresentInWishlist();
  // }, []);

  // const removeAllProducts = async () => {
  //   try {
  //     const response = await axios.delete(
  //       `https://ali-express-clone.onrender.com/api/cart/removeall`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: document.cookie,
  //         },
  //       }
  //     );
  //     console.log("ALL PRODUCTS REMOVED SUCCESSFULLY");
  //     const data = response.data?.cart;
  //     setWishlistItems(data);
  //   } catch (error) {
  //     console.log("ERROR : ", error);
  //   }
  // };
  useEffect(() => {
  const fetchWishlistItems = async () => {
    try {
      const user = getUser(); // Get fresh user data
      const response = await api.getWishlist(user?.id || null);
      setWishlistItems(response.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  fetchWishlistItems();
}, []);

// Add remove function:
const removeFromWishlist = async (productId: string) => {
  try {
    const user = getUser(); // Get fresh user data
    await api.removeFromWishlist(user?.id || null, productId);
    setWishlistItems((prev: any) => prev.filter((item: any) => item.productId !== productId));
    toast({ title: "Success", description: "Removed from wishlist!" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    toast({ title: "Error", description: "Failed to remove from wishlist." });
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
              <button  className="">
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
                 <Image
    src={item?.image}
    alt={item?.name || "Product image"}  // More descriptive alt text
    fill
    sizes="(max-width: 768px) 100vw, 176px" // 44*4=176px
    className="object-cover"
    quality={85}
    priority={false} // Set true if above-the-fold
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
<button 
  onClick={() => removeFromWishlist(item.productId)} 
  className="py-2 px-2 rounded-lg"
>
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
