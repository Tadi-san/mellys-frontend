"use client";

import React, { useEffect, useState } from "react";
import { Loader2Icon, Menu } from "lucide-react";
import { HamburberCategory, ProductsCategory } from "@/config.product";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="text-xl font-bold">Loading Products</div>
      <Loader2Icon className="animate-spin w-7 h-7 ml-2" />
    </div>
  );
};

export default Loading;
