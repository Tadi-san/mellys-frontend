"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ItemCard from "@/components/ItemCard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal
} from "lucide-react";
import { api } from "@/utils/index.api";
import { toast } from "@/components/ui/use-toast";

interface SearchPageProps {
  params: Promise<{ query: string }>;
}

const SearchPage = ({ params }: SearchPageProps) => {
  const [searchParams, setSearchParams] = useState<{ query: string } | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "created_at",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
    limit: 20
  });

  const router = useRouter();
  const urlSearchParams = useSearchParams();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSearchParams(resolvedParams);
      setFilters(prev => ({ ...prev, query: resolvedParams.query }));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchParams) return;
    performSearch();
  }, [searchParams, filters, performSearch]);

  const performSearch = async () => {
    try {
      setIsLoading(true);
      const searchData = await api.searchProducts(filters);
      setSearchResults(searchData);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters(prev => ({ ...prev, sortBy, sortOrder: newSortOrder, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      query: searchParams?.query || "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "created_at",
      sortOrder: "desc",
      page: 1,
      limit: 20
    });
  };

  const updateURL = (newFilters: any) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== "page" && key !== "limit") {
        params.append(key, value.toString());
      }
    });
    router.push(`/search/${encodeURIComponent(newFilters.query)}?${params.toString()}`);
  };

  if (!searchParams || isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Search Results for &quot;{searchParams.query}&quot;
            </h1>
            {searchResults && (
              <p className="text-gray-600">
                {searchResults.pagination.totalCount} products found
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <Card className="lg:w-80 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Query */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search Query</label>
                <Input
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  placeholder="Search products..."
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <div className="space-y-2">
                  {[
                    { key: "created_at", label: "Newest First" },
                    { key: "price", label: "Price" },
                    { key: "name", label: "Name" }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSort(option.key)}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                        filters.sortBy === option.key
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                      {filters.sortBy === option.key && (
                        <span className="ml-2">
                          {filters.sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <div className="flex-1">
          {/* Active Filters */}
          {(filters.category || filters.minPrice || filters.maxPrice) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {categories.find(c => c.id === parseInt(filters.category))?.name}
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.minPrice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min: ETB {filters.minPrice}
                  <button
                    onClick={() => handleFilterChange("minPrice", "")}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max: ETB {filters.maxPrice}
                  <button
                    onClick={() => handleFilterChange("maxPrice", "")}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          {searchResults?.products?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.products.map((product: any) => (
                  <ItemCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {searchResults.pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={!searchResults.pagination.hasPrevPage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: searchResults.pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === searchResults.pagination.totalPages ||
                        Math.abs(page - searchResults.pagination.currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <Button
                            variant={page === searchResults.pagination.currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!searchResults.pagination.hasNextPage}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

