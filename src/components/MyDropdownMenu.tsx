"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChevronDown, Heart, Menu, NotepadText, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { ProductsCategory } from "@/config.product";
import { ScrollArea } from "./ui/scroll-area";
import axios from "axios";
import { useAppDispatch } from "@/lib/store/hooks";
import { setProducts } from "@/lib/store/features/product/productSlice";
import { useRouter } from "next/navigation";

type ProductItem = {
  name: string | null;
  id: number;
};

type ProductCategory = {
  name: string;
  id: number;
  list: ProductItem[];
};

const productsCategory: ProductCategory[] = ProductsCategory;

export function MyDropdownMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [data, setData] = useState<ProductCategory[]>([]);

  // Get Items from API
  const handleItemList = async (name: string | null) => {
    const response = await axios.get(
      `https://ali-express-clone.onrender.com/api/category/${name}`
    );
    dispatch(setProducts(response?.data));

    //TODO : REMOVE
    console.log("Name : ", name);
    console.log("Adding to store!", response);

    router.push(`/search/${name}`);
  };

  useEffect(() => {
    setData(productsCategory);
  }, []);

  return (
    <div className="w-full px-4">
      <HoverCard openDelay={300} closeDelay={300}>
        <HoverCardTrigger asChild>
          <button className="w-fit 
          flex gap-4 justify-between items-center 
          // px-4 py-2 
          rounded-3xl ">
            {/* <div className="flex gap-2 justify-center items-center"> */}
              <Menu className="w-5 h-5" />
              {/* All Categories */}
            {/* </div> */}
            {/* <ChevronDown className="w-5 h-5" /> */}
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 rounded-3xl p-5">
          <ScrollArea className="h-[500px] w-full">
            <div className="">
              {/* CATEGORIES */}
              {data.map((item, index) => (
                <div key={index}>
                  <HoverCard openDelay={300} closeDelay={300}>
                    <HoverCardTrigger asChild>
                      <button
                        key={index}
                        className="p-1 w-full text-start hover:bg-gray-100 hover:font-bold rounded-md"
                      >
                        {item.name}
                      </button>
                    </HoverCardTrigger>

                    <HoverCardContent
                      side="right"
                      className="w-full rounded-3xl p-4 px-10 mt-16"
                    >
                      {/* SUB - CATEGORIES */}
                      <div className="max-h-80 flex flex-wrap flex-col gap-x-2 gap-y-3">
                        {item.list.map((listItem, index) => (
                          <div key={index}>
                            <button
                              onClick={() => handleItemList(listItem.name)}
                              key={index}
                              className="w-full text-start hover:text-red-500 rounded-md text-sm"
                            >
                              {listItem.name}
                            </button>
                          </div>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <Separator className="my-1" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
