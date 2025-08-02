"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
// import {
//   setAuthState,
//   selectAuthState,
// } from "@/lib/store/features/auth/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { api } from "@/utils/index.api";
import { Product } from "@/config.product";
import Image from "next/image";
import { getUser } from "@/utils/auth";

const ItemCard = ({ product }: { product: any }) => {
  const [isLocal, setIsLocal] = useState(true)
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const user = getUser();


  return (
    <div
      key={product.id}
      className="flex flex-col gap-2 md:gap-0 group hover:border hover:shadow-lg relative w-[180px] md:w-[250px] h-[260px] md:h-[350px] overflow-hidden group rounded-lg"
    >
      <div className="relative w-[180px] md:w-[250px] h-[260px] md:h-[350px] overflow-hidden group rounded-lg">
        <Link href={`/products/${product.id}`}>
       <Image
    src={product.images[0]?.image_url || "/placeholder-product.jpg"}
    alt={product.name || "Product image"}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover transition-transform duration-300 hover:scale-105"
    quality={85}
    priority={false} // Set true for above-the-fold images
  />
        </Link>
      </div>

      <div className="hidden md:flex tracking-wider mt-4 mb-1 gap-2 items-center pl-2">
        <Link href={`/products/${product.id}`} className="text-sm line-clamp-1 md:line-clamp-2">
          {product.name}
        </Link>
      </div>

      <Link href={`/products/${product.id}`} className="flex md:hidden text-xl tracking-wide pl-2 justify-start items-center gap-1">
        <div className="md:text-xl"> {` ${product.price} birr`}</div>
      </Link>

      <Link href={`/products/${product.id}`} className="flex md:hidden tracking-tight gap-2 pl-2">
        <p className="text-xs line-clamp-1">{product.name}</p>
      </Link>
    </div>
  );
};

export default ItemCard;
