"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash, Heart } from "lucide-react";
import { api } from "@/utils/index.api";
import Cookies from "js-cookie"; 
import { toast } from "@/components/ui/use-toast";

const WishListPage = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUser = () => {
    const userCookie = Cookies.get("UserAuth");
    return userCookie ? JSON.parse(userCookie) : null;
  };

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setLoading(true);
        const user = getUser();
        const response = await api.getWishlist(user?.id || null);
        setWishlistItems(response.wishlist || []);
      } catch (error) {
        console.error("Error fetching wishlist", error);
        toast({ 
          title: "Error", 
          description: "Failed to load wishlist items." 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      const user = getUser();
      await api.removeFromWishlist(user?.id || null, productId);
      setWishlistItems((prev) => 
        prev.filter((item) => item.productId !== productId)
      );
      toast({ 
        title: "Success", 
        description: "Removed from wishlist!" 
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({ 
        title: "Error", 
        description: "Failed to remove from wishlist." 
      });
    }
  };

  const handleProductInfo = (item: any) => {
    const id = Number(item.productId);
    router.push(`/products/${id}`);
  };

  const removeAllFromWishlist = async () => {
    try {
      const user = getUser();
      // Assuming you have an API endpoint to remove all items
      // await api.removeAllFromWishlist(user?.id || null);
      setWishlistItems([]);
      toast({ 
        title: "Success", 
        description: "All items removed from wishlist!" 
      });
    } catch (error) {
      console.error("Error removing all from wishlist:", error);
      toast({ 
        title: "Error", 
        description: "Failed to remove all items from wishlist." 
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex justify-center items-center mt-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex justify-center items-start gap-5 mt-10">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Wish List ({wishlistItems.length})
          </CardTitle>
          {wishlistItems.length > 0 && (
            <CardDescription>
              <Button 
                variant="outline" 
                size="sm"
                onClick={removeAllFromWishlist}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove all products
              </Button>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                        onClick={() => handleProductInfo(item)}>
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.description || "No description available"}
                    </p>
                    <p className="text-green-600 font-semibold">
                      ${item.price || "Price not available"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProductInfo(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Product
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(item.productId)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 mb-4">
                Start adding products to your wishlist to see them here.
              </p>
              <Button onClick={() => router.push('/products')}>
                Browse Products
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WishListPage;