"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"; // Use your custom dropdown
import { api } from "@/utils/index.api";
import { useRouter } from "next/navigation";



const PostProductPage = () => {
  const router = useRouter();
    const [productData, setProductData] = useState<{
        name: string;
        price: number;
        description: string;
        stock_quantity: number;
        selectedColors: string[]; // Explicitly declare that it's an array of strings
        selectedSizes: string[];
        category: number;
        images: string[];
      }>({
        name: "",
        price: 0,
        description: "",
        stock_quantity: 0,
        selectedColors: [], // Start with an empty array
        selectedSizes: [],
        category: 0,
        images: [],
      });

  // Custom array for colors
const colors = [
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Orange",
    "Pink",
    "Purple",
    "Black",
    "White",
    "Brown",
    "Gray",
    "Beige",
    "Multicolor",
    "Other",
    "None",
  ];
  
  const [imageFiles, setImageFiles] = useState<File[]>([]); // State for selected image files

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files)); // Store selected files
    }
  };

  // Custom array for sizes
  const sizes = ["S", "M", "L", "XL"];
  interface Category {
    id: number; // Assuming 'id' is a string, change to number if that's the case
    name: string;
    img: string;
  }
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
 
//   const [colors, setColors] = useState(Object.values(Color));
//   const [sizes] = useState(Object.values(Size));

const handleImageUpload = async (id:string) => {
    const formData = new FormData();
    
    imageFiles.forEach((file) => {
      formData.append("files", file);
    });
  
    try {
      const response = await api.uploadImage(formData, id);
  
      // Assuming the response contains the uploaded image URLs
      const uploadedImageUrls = response.data.imageUrls; // Replace with the actual response structure
      return uploadedImageUrls; // Return the URLs to use them later
    } catch (error) {
      console.error("Error uploading images:", error);
      return []; // Return empty array in case of failure
    }
  };

  
  const handleProductPost = async () => {
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", String(productData.price));
    formData.append("description", productData.description);
    formData.append("stock_quantity", String(productData.stock_quantity));
    formData.append("category_id", String(productData.category));
    formData.append("colors", productData.selectedColors.join(","));
    formData.append("sizes", productData.selectedSizes.join(","));
    
    try {
      
      const response = await api.postProducts(formData); // Create product
      // } = response.data;
      console.log("Product created successfully", response);
      await handleImageUpload(response.id); // Call upload image with the created product's ID
    
      router.push(`/products/${response.id}`);
      // After product creation, call the upload image function
    } catch (error) {
      console.error("Error posting product:", error);
    }
  };
  

  


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
      setCategories(refinedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  
  useEffect(() => {
    getCategories();
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="w-full flex flex-col max-w-screen-xl mx-auto mt-10">
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-3/4">
          <Card className="border-none shadow-none rounded-xl">
            <CardHeader>
              <CardTitle className="font-bold text-2xl">Post a Product</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="product-name" className="font-semibold">Product Name</label>
                <input
                  type="text"
                  id="product-name"
                  className="p-3 rounded-md border-gray-300 border"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-price" className="font-semibold">Price</label>
                <input
                  type="number"
                  id="product-price"
                  className="p-3 rounded-md border-gray-300 border"
                  value={productData.price}
                  placeholder="in $"
                  onChange={(e) =>
                    setProductData({ ...productData, price: parseFloat(e.target.value) })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-description" className="font-semibold">Description</label>
                <textarea
                  id="product-description"
                  className="p-3 rounded-md border-gray-300 border"
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({ ...productData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
  <label htmlFor="product-images" className="font-semibold text-gray-700">Images</label>
  <div className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
    <input
      type="file"
      id="product-images"
      className="hidden"
      multiple
      onChange={handleImageChange}
    />
    <label
      htmlFor="product-images"
      className="cursor-pointer text-sm text-blue-500 hover:text-blue-600"
    >
      Choose Images
    </label>
    <span className="text-sm text-gray-500">
      {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'No files selected'}
    </span>
  </div>
</div>


              <div className="flex flex-col gap-2">
                <label htmlFor="product-stock" className="font-semibold">Stock Quantity</label>
                <input
                  type="number"
                  id="product-stock"
                  className="p-3 rounded-md border-gray-300 border"
                  value={productData.stock_quantity}
                  onChange={(e) =>
                    setProductData({ ...productData, stock_quantity: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-category" className="font-semibold">Category</label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-3 rounded-md border-gray-300 border">
                    {productData.category || "Select Category"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() =>
                          setProductData({ ...productData, category: category.id })
                        }
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-2">
  <label htmlFor="product-colors" className="font-semibold">Colors</label>
  <div className="flex gap-4 flex-wrap text-xs">
    {colors.map((color: string) => (
      <button
        key={color}
        onClick={() => {
          handleColorChange(color);
          setProductData((prev) => ({
            ...prev,
            selectedColors: selectedColors.includes(color)
              ? selectedColors.filter((item) => item !== color)
              : [...selectedColors, color],
          }));
        }}
        className={`w-10 h-10 rounded-full border-2 truncate ${
          selectedColors.includes(color) ? "border-black scale-105" : "border-gray-300"
        }`}
        style={{
          backgroundColor:
            color === "Other" || color === "None" || color === "Multicolor"
              ? "transparent"
              : color,
        }}
      >
        {color === "Other" && "Other..."}
        {color === "None" && "No Color"}
        {color === "Multicolor" && "Multicolor"}
      </button>
    ))}
  </div>
</div>

<div className="flex flex-col gap-2">
  <label htmlFor="product-sizes" className="font-semibold">Sizes</label>
  <div className="flex gap-4">
    {sizes.map((size) => (
      <button
        key={size}
        onClick={() => {
          handleSizeChange(size);
          setProductData((prev) => ({
            ...prev,
            selectedSizes: selectedSizes.includes(size)
              ? selectedSizes.filter((item) => item !== size)
              : [...selectedSizes, size],
          }));
        }}
        className={`px-4 py-2 border rounded-md ${
          selectedSizes.includes(size) ? "border-black scale-105" : "border-gray-300"
        }`}
      >
        {size}
      </button>
    ))}
  </div>
</div>


              <div className="flex gap-4 justify-center mt-4">
                <Button onClick={handleProductPost} variant="myBtn" size="mySize">
                  Post Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostProductPage;
