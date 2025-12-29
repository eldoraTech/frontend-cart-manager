import { useState, useMemo } from 'react';
import { getProducts } from '@/lib/storage';
import { FilterState, SortOption, Product } from '@/types/product';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

const Index = () => {
  const [products] = useState<Product[]>(getProducts());
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  
  const maxPrice = useMemo(() => {
    return Math.ceil(Math.max(...products.map((p) => p.price), 200));
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    sizes: [],
    priceRange: [0, maxPrice],
    hasDiscount: null,
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Your Style
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated collection of premium fashion essentials for the modern wardrobe
          </p>
        </section>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar value={filters.search} onChange={(v) => setFilters({ ...filters, search: v })} />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              <span className="ml-2">Filters</span>
            </Button>
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">No products found</p>
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 StyleStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
