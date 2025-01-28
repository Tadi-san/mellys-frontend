"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  setAuthState,
  selectAuthState,
} from "@/lib/store/features/auth/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { api } from "@/utils/index.api";
import { Product } from "@/config.product";

const ItemCard = ({ product }: { product: any }) => {
  const dispatch: AppDispatch = useDispatch();
  const [isLocal, setIsLocal] = useState(true)
  const isAuthenticated = useSelector((state: RootState) =>
    selectAuthState(state)
  );
  // const isLocal = useSelector((state: RootState) =>
  //   selectAuthState(state)
  // );
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const token = Cookies.get("UserAuth");
    dispatch(setAuthState(!!token)); // Update Redux state based on cookie presence
  }, [dispatch]);

  // Check if the product is already in the cart
  // const checkIfProductInCart = async () => {
  //   try {
  //     const cartResponse = await api.getCart(); // Using the new API function
  //     const cartItems = cartResponse.data?.cart || [];
  //     const isPresent = cartItems.some((item: any) => item.productId === product.id);
  //     if (isPresent) {
  //       const existingItem = cartItems.find((item: any) => item.productId === product.id);
  //       setQuantity(existingItem?.quantity || 1);
  //     }
  //   } catch (error) {
  //     console.error("Error checking cart:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     checkIfProductInCart();
  //   }
  // }, [isAuthenticated]);

  // Add product to cart
  // const handleAddToCart = async () => {
  //   // if (!isAuthenticated) {
  //   //   router.push("/login");
  //   //   return;
  //   // }
  //   try {
  //     const response = await api.addToCart(
  //       product.id,
  //      product.name,
  //       (product.price * 83).toFixed(2),
  //    product.image, // Assuming 'image' is part of the product data
  //       quantity,
  //    "s", // Assuming size 'm', adjust accordingly
  //     );
  //     toast({
  //       title: "Item added to cart",
  //       className: "text-red-600 bg-white hover:bg-gray-100 font-bold",
  //     });
  //   } catch (error) {
  //     console.log("ERROR adding to cart : ", error);
  //   }
  // };

  // Update item quantity in cart
  const handleUpdateCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      await api.updateCart(
        product.id,
        quantity,
      );
      toast({
        title: "Cart updated successfully",
        className: "text-red-600 bg-white hover:bg-gray-100 font-bold",
      });
    } catch (error) {
      console.log("ERROR updating cart : ", error);
    }
  };

  return (
    <div
      key={product.id}
      className="flex flex-col gap-2 md:gap-0 group hover:border hover:shadow-lg relative w-[180px] md:w-[250px] h-[260px] md:h-[350px] overflow-hidden group rounded-lg"
    >
      <div className="relative w-[180px] md:w-[250px] h-[260px] md:h-[350px] overflow-hidden group rounded-lg">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.images[0]?.image_url || ""}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 border rounded-lg"
          />
        </Link>
      </div>

      <div className="hidden md:flex tracking-wider mt-4 mb-1 gap-2 items-center pl-2">
        <Link href={`/products/${product.id}`} className="text-sm line-clamp-1 md:line-clamp-2">
          {product.name}
        </Link>
      </div>
      {/* <div className="hidden md:flex text-xs tracking-widest font-bold pl-2 mb-5 mt-2 justify-between items-center">
        <div>
          <span className="md:text-xl">{isLocal ?`${ product.price * 127}br`: `$${product.price}`}</span>
        </div>
        <button onClick={handleAddToCart}>
          <ShoppingCart className="w-5 sm:w-12 h-10 sm:h-12 absolute bottom-2 right-2 bg-white sm:p-3 rounded-full sm:hover:bg-black sm:hover:text-white align-middle" />
        </button>
      </div> */}

      <Link href={`/products/${product.id}`} className="flex md:hidden text-xl tracking-wide pl-2 justify-start items-center gap-1">
        <div className="md:text-xl">{isLocal ? `${ product.price * 127}br` : `$${product.price}`}</div>
      </Link>

      <Link href={`/products/${product.id}`} className="flex md:hidden tracking-tight gap-2 pl-2">
        <p className="text-xs line-clamp-1">{product.name}</p>
      </Link>
    </div>
  );
};

export default ItemCard;
