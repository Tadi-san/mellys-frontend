"use client";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { ItemQty } from "./ItemQtyAlert";
import Image from "next/image";
export default function OrderItem(prompt: { orderItem: OrderItem }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-row w-full justify-between my-2">
      <div className="flex flex-row">
<Image
    src="/products/p2.jpg"
    alt="product-img"
    width={48}
    height={48}
    className="h-full w-full object-cover"
    quality={85}  // Optimal balance of quality/size (default: 75)
    loading="lazy" // Already lazy by default in Next.js
  />
        <div className="flex flex-col mx-4">
          <p className=" font-light text-sm text-black">
            {prompt.orderItem.name}
          </p>
          <div
            onClick={handleClickOpen}
            className="flex flex-row cursor-pointer my-1 bg-gray-200 justify-center rounded-sm p-0.5"
          >
            <p className="text-xs text-black">
              {"Qty " + prompt.orderItem.quantity}
            </p>
            <RiArrowDropDownLine />
          </div>
          <ItemQty
            orderItem={prompt.orderItem}
            open={open}
            onClose={handleClose}
          />
        </div>
      </div>
      <div className="items-start text-right">
        <h2 className=" font-light text-sm text-black">
          {"$" +
            (prompt.orderItem.price * prompt.orderItem.quantity).toFixed(2)}
        </h2>
        <p className=" font-light text-xs  my-1">
          {"$" + prompt.orderItem.price.toFixed(2) + " each"}
        </p>
      </div>
    </div>
  );
}
