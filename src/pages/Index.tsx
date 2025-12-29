import { useState, useMemo, useEffect } from 'react';
import { getProducts } from '@/lib/firebase';
import { FilterState, SortOption, Product } from '@/types/product';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);
  
  const maxPrice = useMemo(() => {
    return Math.ceil(Math.max(...products.map((p) => p.price), 200));
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    sizes: [],
    priceRange: [0, 500],
    hasDiscount: null,
  });

  useEffect(() => {
    if (products.length > 0) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, maxPrice],
      }));
    }
  }, [maxPrice, products.length]);

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      sizes: [],
      priceRange: [0, maxPrice],
      hasDiscount: null,
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        filters.sizes.some((size) => p.sizes.includes(size))
      );
    }

    // Price range filter
    result = result.filter((p) => {
      const finalPrice = p.price * (1 - p.discount / 100);
      return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
    });

    // Discount filter
    if (filters.hasDiscount === true) {
      result = result.filter((p) => p.discount > 0);
    }

    // Sort
    result.sort((a, b) => {
      const priceA = a.price * (1 - a.discount / 100);
      const priceB = b.price * (1 - b.discount / 100);

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'discount-desc':
          return b.discount - a.discount;
        default:
          return 0;
      }
    });

    return result;
  }, [products, filters, sortOption]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.hasDiscount !== null) count++;
    return count;
  }, [filters, maxPrice]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Discover Your Style
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Curated collection of premium fashion essentials for the modern wardrobe
          </p>
        </section>

        {/* Search and Sort Bar */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-full">
            <SearchBar value={filters.search} onChange={(v) => setFilters({ ...filters, search: v })} />
          </div>
          <div className="flex gap-2 sm:gap-3">
            {/* Mobile Filter Sheet */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden flex-1 sm:flex-none relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-80 p-0 overflow-y-auto">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => {
                      resetFilters();
                      setShowFilters(false);
                    }}
                    maxPrice={maxPrice}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex-1 sm:flex-none sm:ml-auto">
              <SortDropdown value={sortOption} onChange={setSortOption} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p className="text-muted-foreground text-sm sm:text-base">
                Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <p className="text-muted-foreground text-base sm:text-lg mb-4">No products found</p>
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-12 sm:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm sm:text-base">
          <p>© 2024 StyleStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
