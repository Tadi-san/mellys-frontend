"use client";

import { Suspense, useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { api } from "@/utils/index.api";
import Link from "next/link";
import Cookies from "js-cookie";

// Skeleton Loader for Categories
const CategorySkeleton = () => (
  <div className="flex flex-col gap-2 justify-start items-center animate-pulse">
    <div className="w-12 h-12 bg-gray-300 rounded-full" />
    <div className="w-20 h-4 bg-gray-300 rounded" />
  </div>
);

// Skeleton Loader for Products
const ProductSkeleton = () => (
  <div className="flex flex-col gap-2 md:gap-0 group hover:border hover:shadow-lg relative w-[180px] md:w-[250px] h-[260px] md:h-[350px] overflow-hidden group rounded-lg animate-pulse">
    <div className="relative w-full h-full bg-gray-300" />
    <div className="w-24 h-4 bg-gray-300 rounded mt-4 mb-1 mx-2" />
    <div className="w-16 h-6 bg-gray-300 rounded mt-2 mx-2" />
  </div>
);

export default function Home() {
  const [products, setProducts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
        ]);

        // Filter and map categories
        const refinedCategories = categoriesResponse
          .filter((category: any) => category.parentId === null)
          .map((category: any) => ({
            id: category.id,
            name: category.name,
            img: category.images.length > 0 ? category.images[0].image_url : "",
          }))
          .slice(0, 8);
        setCategories(refinedCategories);

        // Set products
        setProducts(productsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex flex-col items-center">
      <div className="relative w-full max-w-screen-2xl">
        <div className="flex gap-2 justify-around mb-5">
          {loadingCategories
            ? Array(8)
                .fill(0)
                .map((_, index) => <CategorySkeleton key={index} />)
            : categories.map((item: any) => (
                <Link
                  href={`/search/${item.name}`}
                  key={item.id}
                  className="flex flex-col gap-1 justify-start items-center"
                >
                  <img
                    src={item.img}
                    alt="img"
                    className="w-12 h-12 object-contain rounded-full"
                  />
                  <div className="text-xs text-start">{item.name}</div>
                </Link>
              ))}
        </div>
        <div className="flex flex-wrap gap-y-5 gap-x-2 md:gap-10 justify-center">
          {loadingProducts
            ? Array(8)
                .fill(0)
                .map((_, index) => <ProductSkeleton key={index} />)
            : products &&
              products.map((product: any, index: number) => (
                <div key={index}>
                  <ItemCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}