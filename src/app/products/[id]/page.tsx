"use client";

import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Heart, Lock, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import LoadingPage from "@/app/loading";
import { api } from "@/utils/index.api";
import SkeletonLoading from "@/components/singleProductSkeletonLoading";
import Cookies from "js-cookie";
import Image from "next/image";
import LoginModal from "@/components/auth/LoginModal";
import { getUser, isAuthenticated } from "@/utils/auth";
const ProductDescription = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLocal, setIsLocal] = useState(true)
  const [user, setUser] = useState<any>(getUser());
  const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
   const fetchProductDetailsAndCartStatus = async () => {
  try {
    const productResponse = await api.getProductDetails(params.id);
    setProduct(productResponse);

    const user = getUser(); // Get fresh user data
    const cartResponse = await api.getCart(user?.id || null);
    const cartItems = cartResponse.cart || [];
    const isPresent = cartItems.some(
      (item: any) => item.productId === productResponse.id
    );
    setIsInCart(isPresent);
    setQuantity(isPresent ? cartItems.find((item: any) => item.productId === productResponse.id)?.quantity || 1 : 1);
  } catch (error) {
    console.error("Error fetching product details and cart status:", error);
  }
};

    fetchProductDetailsAndCartStatus();
  }, [params.id, user?.id]);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const wishlistResponse = await api.getWishlist(user?.id);
        const wishlistItems = wishlistResponse || [];
        const isPresent = wishlistItems.some(
          (item: any) => item.product_id === product?.id
        );
        setIsAddedToWishlist(isPresent);
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    };

    if (user?.id && product) {
      fetchWishlistStatus();
    }
  }, [product, user?.id]);

<<<<<<< HEAD
const handleAddToCart = async () => {
  try {
    if (!selectedColor || !selectedSize) {
      toast({ title: "Error", description: "Please select a color and size." });
      return;
=======
  const handleAddToCart = async () => {
    try {
      if (!selectedColor || !selectedSize) {
        toast({ title: "Error", description: "Please select a color and size." });
        return;
      }

      await api.addToCart(
        product.id,
        product.name,
        product.price,
        product.images[0].image_url,
        quantity,
        selectedSize,
        selectedColor,
        user?.id
      );
      setIsInCart(true);
      toast({ title: "Success", description: "Item added to cart successfully." });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({ title: "Error", description: "Failed to add item to cart." });
>>>>>>> b3e788d4a56a5a0648b610c1b5b7a463f3d87a1c
    }

    const user = getUser(); // Get fresh user data
    await api.addToCart(
      user?.id || null,
      product.id,
      product.name,
      product.price,
      product.images[0].image_url,
      quantity,
      selectedSize,
      selectedColor
    );
    setIsInCart(true);
    toast({ title: "Success", description: "Item added to cart!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast({ title: "Error", description: "Failed to add item to cart." });
  }
};


  const handleUpdateCart = async () => {
    try {
      await api.updateCart(product.id, quantity);
      toast({ title: "Success", description: "Cart updated successfully." });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

<<<<<<< HEAD
const handleWishList = async () => {
  const user = getUser(); // Get fresh user data
  if (isAddedToWishlist) {
    try {
      await api.removeFromWishlist(user?.id || null, product.id);
      setIsAddedToWishlist(false);
      toast({ title: "Success", description: "Removed from wishlist!" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({ title: "Error", description: "Failed to remove from wishlist." });
=======
  const handleWishList = async () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    if (isAddedToWishlist) {
      try {
        await api.removeFromWishlist(product.id, user.id);
        setIsAddedToWishlist(false);
        toast({ title: "Success", description: "Removed from wishlist." });
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast({ title: "Error", description: "Failed to remove from wishlist." });
      }
    } else {
      try {
        await api.addToWishlist(user.id, product.id );
        setIsAddedToWishlist(true);
        toast({ title: "Success", description: "Added to wishlist." });
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast({ title: "Error", description: "Failed to add to wishlist." });
      }
>>>>>>> b3e788d4a56a5a0648b610c1b5b7a463f3d87a1c
    }
  } else {
    try {
      await api.addToWishlist(
        user?.id || null,
        product.id,
        product.name,
        product.price,
        product.images[0].image_url
      );
      setIsAddedToWishlist(true);
      toast({ title: "Success", description: "Added to wishlist!" });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({ title: "Error", description: "Failed to add to wishlist." });
    }
  }
};

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
        toast({
          title: "Error",
          description: "Failed to copy the link. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleLoginSuccess = () => {
    setUser(getUser());
  };
  if (!product) {
    return <SkeletonLoading />;
  }

  return (
    <div className="w-full flex flex-col max-w-screen-2xl mx-auto mt-10">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      <div className="w-full flex flex-col md:flex-row  md:items-start md:gap-2">
        <div className="flex flex-wrap w-full md:w-3/4 justify-center items-center">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center md:items-start w-full ">
            <Carousel
              opts={{
                loop: true,
              }}
              className="w-full max-w-md group"
            >
              <CarouselContent>
                {product.images.map((item: any, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="border-none shadow-none rounded-xl ">
                        <CardContent className="flex items-center justify-center p-2 overflow-hidden">
  <Image
    src={item.image_url}
    alt="Product image"
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover group-hover:scale-110 transition-transform duration-300"
    quality={85}
  />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:inline-flex opacity-60 group-hover:opacity-100 transition-all duration-300 h-10 w-10 bg-gray-200" />
              <CarouselNext className="hidden md:inline-flex opacity-60 group-hover:opacity-100 transition-all duration-300 h-10 w-10 bg-gray-200" />
            </Carousel>

            <div className="flex flex-col gap-5 px-6 md:px-2 items-start justify-start w-full ">
              <div className="font-bold text-xl md:text-4xl mt-2">{isLocal ?`${ product.price * 127}br`: `$${product.price}`}</div>
              <div className="font-bold text-sm md:text-xl">{product.name}</div>
              <div className="text-xs">{product.stock_quantity} items available</div>

              <div className="flex flex-col gap-5 ">
                <hr />

                {product.colors.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">Select Color</p>
                    <div className="flex gap-4">
                      {product.colors.map((color: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-transform duration-300 ${
                            selectedColor === color ? "border-black scale-105" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">Select Size</p>
                    <div className="flex gap-4">
                      {product.sizes.map((size: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md transition-transform duration-300 ${
                            selectedSize === size ? "border-black scale-105" : "border-gray-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full p-4 md:p-0 md:w-1/4">
          <Card className="">
            <CardContent className="mt-4 flex flex-col gap-4 w-full text-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" />
                  <div>Security & Privacy</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Safe payments: We do not share your personal details with any
                  third parties without your consent. <br /> Secure personal
                  details: We protect your privacy and keep your personal
                  details safe and secure.
                </div>
              </div>
              <hr />

              <div
>
              </div>

              <hr />

              <div className="flex flex-col gap-2 items-center md:items-start">
                <p className="font-bold"> Quantity</p>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() =>
                      setQuantity((prev) => {
                        if (prev <= 1) {
                          return prev;
                        }
                        return (prev -= 1);
                      })
                    }
                    className="bg-gray-100 rounded-full p-2"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <p className="font-bold">{quantity}</p>
                  <button
                    onClick={() => setQuantity((prev) => (prev += 1))}
                    className="bg-gray-100 rounded-full p-2"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {isInCart ? (
                <Button
                  onClick={() => handleUpdateCart()}
                  variant="myBtn"
                  size="mySize"
                >
                  Add To Cart
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleAddToCart();
                  }}
                  variant="myBtn"
                  size="mySize"
                >
                  Add To Cart
                </Button>
              )}

              <div className="flex justify-center items-center gap-5 ">
              <button
        onClick={handleCopyLink}
        className="rounded-3xl p-3 bg-accent w-1/2 flex justify-center group hover:scale-105 transition-all duration-300"
      >
        <Share2 className="w-5 h-5 group-hover:scale-105 transition-all duration-300" />
      </button>
                <button
                  onClick={() => handleWishList()}
                  className="rounded-3xl p-3 bg-accent w-1/2 flex justify-center group hover:scale-105 transition-all duration-300"
                >
                  {isAddedToWishlist ? (
                    <Heart
                      fill="red"
                      stroke="red"
                      className="w-5 h-5 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <Heart className="w-5 h-5 group-hover:scale-105 transition-all duration-300" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description Component  */}
      <div>
        <div className="w-full">
          <Tabs defaultValue="1" className="w-full mt-10 mb-20">
            <TabsList className="flex flex-wrap md:grid md:grid-cols-3 md:w-1/2">
              <TabsTrigger className="" value="1">
                Specifications
              </TabsTrigger>
              <TabsTrigger className="" value="3">
                Description
              </TabsTrigger>
              <TabsTrigger className="" value="2">
                Customer Reviews
              </TabsTrigger>
            </TabsList>

            {/* Specifications */}
            <TabsContent value="1">
              <Card className="border-none shadow-none mt-8 md:mt-0">
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>

                {/* SPECIFICATIONS FOR BIGGER SCREENS  */}
                <CardContent className="hidden md:flex flex-wrap w-full">
                  <div className="w-1/2">
                    {/* <Table>
                      <TableBody>
                        {product.properties.list
                          .slice(
                            0,
                            Math.ceil(product.properties.list.length / 2)
                          )
                          .map((property: any, index: any) => (
                            <TableRow key={index}>
                              <TableCell className="bg-accent">
                                {property.name}
                              </TableCell>
                              <TableCell className="text-left ">
                                {property.value}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table> */}
                  </div>
                  <div className="w-1/2">
                    <Table>
                      {/* <TableBody>
                        {product.properties.list
                          .slice(Math.ceil(product.properties.list.length / 2))
                          .map((property: any, index: any) => (
                            <TableRow key={index}>
                              <TableCell className="bg-accent">
                                {property.name}
                              </TableCell>
                              <TableCell className="text-left">
                                {property.value}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody> */}
                    </Table>
                  </div>
                </CardContent>

                {/* SPECIFICATIONS FOR MOBILE DEVICES  */}
                <CardContent className="flex flex-wrap w-full md:hidden">
                  <Table>
                    <TableBody className="">
                      {/* {product.properties.list.map(
                        (property: any, index: any) => (
                          <TableRow key={index}>
                            <TableCell className="bg-accent">
                              {property.name}
                            </TableCell>
                            <TableCell className="text-left line-clamp-1">
                              {property.value}
                            </TableCell>
                          </TableRow>
                        )
                      )} */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customer Reviews  */}
            <TabsContent value="2">
              <Card className="border-none shadow-none mt-8">
                <CardHeader>
                  <CardTitle> Customer Reviews (0)</CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>

            {/* Description  */}
            <TabsContent value="3">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap md:grid md:grid-cols-3 md:gap-4 w-full">
                {product.images.slice(1).map((src: any, index: any) => (
  <div key={index} className="">
<Image
    src={src}
    alt="img"
    fill
    sizes="420px"
    className="object-contain"
    quality={85}
  />
  </div>
))}

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
