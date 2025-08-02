"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { api } from "@/utils/index.api";
import Image from "next/image";
// import api from "@/api/index.api";
const HamburgerMenu = () => {
  const [data, setData] = useState<any>([]);

  async function getCategories() {
    try {
      const response = await api.getCategories();
  
      // Filter and map the response
      const refinedCategories = response
        .filter((category: any) => category.parentId === null) // Include only parent categories
        .map((category: any) => ({
          id: category.id,
          name: category.name,
          img: category.images.length > 0 ? category.images[0].image_url : "", // Get the first image or an empty string
        }));
      setData(refinedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  
  useEffect(() => {
    getCategories();
  }, []);
  

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <Separator className="my-1 mt-12" />
        <SheetHeader className="mt-6">
          <SheetTitle className="text-base font-normal flex justify-around gap-12 text-start flex-wrap">
            {data.map((item: any) => (
              <Link href={`/search/${item.name}`} key={item.id} className="">
                <SheetClose className="flex flex-col gap-2 justify-start items-start">
              <Image
    src={item.img}
    alt={item.name || "Product thumbnail"} // More descriptive alt text
    width={48}
    height={48}
    className="object-contain rounded-lg"
    quality={80} // Slightly higher quality for small images
  />
                  <div className="text-xl text-start">{item.name}</div>
                </SheetClose>
              </Link>
              
            ))}
          </SheetTitle>
          <Separator className="my-1 mt-12" />

          <SheetDescription></SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
