"use client";

import React from "react";

const SkeletonLoading = () => {
    return (
      <div className="animate-pulse flex flex-col max-w-screen-2xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row gap-2 md:items-start">
          <div className="flex flex-wrap w-full md:w-3/4 justify-center items-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
              {/* Carousel Skeleton */}
              <div className="w-full max-w-md bg-gray-200 h-[450px] rounded-xl"></div>
  
              <div className="flex flex-col gap-5 px-6 md:px-2 items-start w-full">
                {/* Price */}
                <div className="bg-gray-200 w-1/4 h-8 rounded"></div>
                {/* Name */}
                <div className="bg-gray-200 w-1/2 h-6 rounded"></div>
                {/* Stock Quantity */}
                <div className="bg-gray-200 w-1/3 h-4 rounded"></div>
  
                <div className="flex flex-col gap-5 w-full">
                  <hr className="border-gray-300" />
                  {/* Colors */}
                  <div className="flex flex-col gap-2">
                    <div className="bg-gray-200 w-1/4 h-4 rounded"></div>
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-200 w-10 h-10 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>
  
                  {/* Sizes */}
                  <div className="flex flex-col gap-2">
                    <div className="bg-gray-200 w-1/4 h-4 rounded"></div>
                    <div className="flex gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-200 w-12 h-8 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Sidebar */}
          <div className="w-full p-4 md:p-0 md:w-1/4">
            <div className="bg-gray-200 w-full h-40 rounded"></div>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="w-full mt-10">
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 w-32 h-8 rounded"
              ></div>
            ))}
          </div>
          <div className="mt-8 bg-gray-200 w-full h-64 rounded"></div>
        </div>
      </div>
    );
  };

  export default SkeletonLoading;