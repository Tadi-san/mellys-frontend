"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp, Clock, Star } from "lucide-react";
import { api } from "@/utils/index.api";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularCategories, setPopularCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Load popular categories
    loadPopularCategories();
  }, []);

  const loadPopularCategories = async () => {
    try {
      const categories = await api.getCategories();
      setPopularCategories(categories.slice(0, 8)); // Show first 8 categories
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Add to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search results
    router.push(`/search/${encodeURIComponent(query)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        <p className="text-gray-600">Find exactly what you're looking for</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search for products, categories, or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {search}
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500"
                >
                  Clear History
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent searches
              </p>
            )}
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Popular Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {popularCategories.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {popularCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleSearch(category.name)}
                    className="text-left p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Loading categories...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Search Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Product Names</h4>
              <p className="text-gray-600">Search for specific product names or brands</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <p className="text-gray-600">Browse products by category or type</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <p className="text-gray-600">Search for products with specific features</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Price Range</h4>
              <p className="text-gray-600">Use filters to find products within your budget</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchPage;
