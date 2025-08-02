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
import { toast } from "@/components/ui/use-toast";
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
            });
          }

              // Create checkout session with Paddle
              //     const checkoutSession = await paddleConfig.createCheckoutSession(
              //       productId,
              //       userId,
              //       userEmail,
              //       { credits: productConfig.credits }
              //     );
              // 
                  res.json({
                          success: true,
                                checkout_url: checkoutSession.checkout_url,
                                      product: {
                                                name: productConfig.name,
                                                        credits: productConfig.credits,
                                                                type: <productConfig className="type">      }
                                                                    });
                                                                    
                                                                      } catch (error) {
                                                                            console.error('Checkout creation error:', error);
                                                                                res.status(500).json({
                                                                                        success: false,
                                                                                              message: 'Failed to create checkout session',
                                                                                                    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
                                                                                });
                                                                              }
                                                                              };

                                                                              /**
                                                                               * Create subscription checkout session * @route POST /be */
                                                                                })
                                                                      }</productConfig>
                                      }
                  })</CardContent>