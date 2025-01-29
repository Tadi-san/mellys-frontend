"use client";

import {
  ChevronDown,
  Heart,
  NotepadText,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { MyDropdownMenu } from "./MyDropdownMenu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  setAuthState,
  selectAuthState,
} from "@/lib/store/features/auth/authSlice";

const Navbar = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) =>
    selectAuthState(state)
  );
  const [quantity, setQuantity] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const router = useRouter();

  // useEffect(() => {
  //   const checkCartQuantity = async () => {
  //     try {
  //       // Check if the product is in the cart
  //       const cartResponse = await axios.get(
  //         "https://ali-express-clone.onrender.com/api/cart/data",
  //         {
  //           headers: {
  //             Authorization: document.cookie,
  //           },
  //         }
  //       );

  //       const cartLength = cartResponse.data?.cart.length;
  //       setQuantity(cartLength);
  //     } catch (error) {
  //       setQuantity(0);
  //     }
  //   };
  //   checkCartQuantity();
  // }, [quantity]);

  useEffect(() => {
    const token = Cookies.get("UserAuth");
    dispatch(setAuthState(!!token)); // Update Redux state based on cookie presence
  }, [dispatch]);

  const handleSearchChange = (e: any) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = async () => {
    console.log("searchInput", searchInput);
    router.push(`/search/${searchInput}`);
    setSearchInput("");
  };

  const handleLogOut = () => {
    Cookies.remove("UserAuth");
    dispatch(setAuthState(false)); // Update Redux state on logout
    router.replace("/");
  };

  const handleGoToCart = () => {
    if (isAuthenticated) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };
// notice me vercel
  return (
    <nav className="w-full hidden md:flex flex-col justify-center items-center p-2 sticky top-0 left-0 z-50 bg-[#191919] text-background">
      <ul className="flex gap-2 p-2 w-full max-w-screen-2xl justify-center">
        <div className="flex gap-2 justify-center items-center">
        <MyDropdownMenu />
          
          <Link href="/">
            <img className="w-56" alt="logo" src="/logo.jpg " />
          </Link>
       
        </div>
        <div className="w-1/3 p-2 relative flex justify-center items-center">
          <Input
            className="rounded-full bg-gray-200 text-black px-4"
            placeholder="smart watches for men"
            onChange={handleSearchChange}
          />
          <button onClick={() => handleSearch()}>
            <Search className="absolute top-[18px] right-5 text-gray-700 w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 justify-center items-center">
          <HoverCard openDelay={300} closeDelay={300}>
            <HoverCardTrigger asChild>
              <button className="flex gap-2 justify-center items-center">
                <User className="w-8 h-8" />
                {isAuthenticated ? ( // change the logic dont check isAuthenticated
                  <div className="flex flex-col text-start flex-wrap pr-2">
                    <p className="text-sm line-clamp-1">Hi, User</p>
                    <div className="text-xs flex items-center gap-1">
                      <p className="">Account</p>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col text-start flex-wrap">
                    <p className="text-sm ">Welcome</p>
                    <div className="text-xs flex items-center gap-1">
                      <p className="">Sign In / Register</p>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 rounded-3xl p-4">
              <div className="w-full flex flex-col items-center justify-center gap-5 mt-2">
                {isAuthenticated ? (
                  <Button
                    variant="default"
                    className="w-full rounded-full text-xl py-6"
                    onClick={handleLogOut}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href="/login" className="w-full rounded-full">
                      <Button
                        variant="default"
                        className="w-full rounded-full text-xl py-6"
                      >
                        Sign In
                      </Button>
                    </Link>

                    <Link href="/register" className="w-full rounded-full">
                      <Button
                        variant="secondary"
                        className="w-full rounded-full text-xl py-6"
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
                <Separator />
                <div className="w-full flex flex-col gap-2 items-start">
                  <button className="flex gap-2 items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 hover:text-red-500 group">
                    <NotepadText className="w-4 h-4 group-hover:text-foreground" />
                    <p>My Order</p>
                  </button>
                  <Link
                    href="/wishlist"
                    className="flex gap-2 items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 hover:text-red-500 group"
                  >
                    <Heart className="w-4 h-4 group-hover:text-foreground" />
                    <p>Wish List</p>
                  </Link>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <button
            onClick={() => handleGoToCart()}
            className="flex gap-2 justify-center items-center relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <div className="flex flex-col">
              <p className="text-xs bg-white text-black rounded-full text-center">
                {quantity}
              </p>
              <p className="flex flex-col text-start text-sm">Cart</p>
            </div>
          </button>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
