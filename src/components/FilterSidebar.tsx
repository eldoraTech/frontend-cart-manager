import { FilterState } from '@/types/product';
import { CATEGORIES, SIZES } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  maxPrice: number;
}

const FilterSidebar = ({ filters, onChange, onReset, maxPrice }: FilterSidebarProps) => {
  const handleCategoryChange = (category: string) => {
    onChange({
      ...filters,
      category: filters.category === category ? '' : category,
    });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: newSizes });
  };

  const handlePriceChange = (value: number[]) => {
    onChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleDiscountChange = (checked: boolean) => {
    onChange({ ...filters, hasDiscount: checked ? true : null });
  };

  const hasActiveFilters =
    filters.category ||
    filters.sizes.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.hasDiscount !== null;

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Category
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.category === category
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Sizes
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.sizes.includes(size)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Price Range
        </h3>
        <Slider
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={handlePriceChange}
          max={maxPrice}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Discount */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Discount
        </h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasDiscount"
            checked={filters.hasDiscount === true}
            onCheckedChange={handleDiscountChange}
          />
          <Label htmlFor="hasDiscount" className="text-sm cursor-pointer">
            On Sale Only
          </Label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
