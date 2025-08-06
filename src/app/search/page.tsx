"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { ChevronsUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import Loading from "@/components/Loading";

interface SearchPageProps {
  params: Promise<{ name: string }>;
}

const ProductList = ({ params }: SearchPageProps) => {
  const [products, setProducts] = useState<any>();
  const [name, setName] = useState("");
  const [searchParams, setSearchParams] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSearchParams(resolvedParams);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!searchParams) return;

    const fetchProducts = async () => {
      const paramName = searchParams.name;
      console.log("PARAM NAME : ", typeof paramName);

      try {
        const response = await axios.get(
          `https://ali-express-clone.onrender.com/api/category/${paramName}`
        );
        console.log("List : ", response.data?.result);
        setProducts(response.data?.result?.resultList);
        setName(response.data?.result?.base?.q);
      } catch (error) {
        console.error(error);
      }
    };
    
    setName(searchParams.name);
    fetchProducts();
  }, [searchParams]);

  if (!products || !searchParams) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto md:mt-10">
      <div className="block md:hidden text-center font-bold text-xl">
        {name}
      </div>

      <div className="hidden md:flex justify-between items-center text-sm">
        <div className="text-2xl font-bold">{name}:</div>
        <div className="flex gap-2 items-center">
          <p>Sort by:</p>
          <div className="flex justify-center items-center gap-5 border rounded-3xl px-4 py-2">
            <button className="">Best Match</button>
            <Separator className="h-6" orientation="vertical" />
            <button className="">Orders</button>
            <Separator className="h-6" orientation="vertical" />
            <button className="flex justify-center items-center">
              <span>Prices</span>
              <ChevronsUpDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-screen-xl flex flex-wrap gap-5 justify-center md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 mt-5">
        {products.map((product: any, index: number) => (
          <div key={index}>
            <ItemCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
