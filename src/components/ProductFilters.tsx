import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { 
  useAppSelector, 
  useAppDispatch 
} from '@/hooks';
import { 
  setActiveCategory, 
  setPriceRange, 
  setShowOnSale,
  setMinDiscountPercentage,
  clearFilters,
  fetchProducts
} from '@/store/slices/productsSlice';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface ProductFiltersProps {
  setCurrentPage: (page: number) => void;
}

export const ProductFilters = ({ setCurrentPage }: ProductFiltersProps) => {
  const { 
    categories,
    activeCategory,
    priceRange,
    minPrice,
    maxPrice,
    showOnSale,
    minDiscountPercentage,
    searchQuery
  } = useAppSelector(state => state.products);
  
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== activeCategory) {
      dispatch(setActiveCategory(categoryParam));
    }
  }, [searchParams, dispatch, activeCategory]);
  
  const handleCategoryClick = (category: string) => {
    // If clicking the already active category, clear it
    const newCategory = category === activeCategory ? null : category;
    dispatch(setActiveCategory(newCategory));
    setCurrentPage(1);
    
    // Update URL query parameter without reloading the page
    if (newCategory) {
      // Keep other query parameters but update/add category
      navigate({ 
        search: searchQuery 
          ? `?category=${newCategory}&search=${searchQuery}` 
          : `?category=${newCategory}` 
      }, { replace: true });
    } else {
      // Remove category parameter but keep others
      navigate({ 
        search: searchQuery ? `?search=${searchQuery}` : ''
      }, { replace: true });
    }
    
    // Fetch products with new filters
    dispatch(fetchProducts({ 
      category: newCategory || undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
    }));
  };
  
  const handlePriceChange = (value: number[]) => {
    dispatch(setPriceRange([value[0], value[1]]));
  };
  
  const handlePriceChangeCommit = () => {
    setCurrentPage(1);
    
    // Fetch products with new price range
    dispatch(fetchProducts({
      category: activeCategory || undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
    }));
  };
  
  const handleSaleToggle = (checked: boolean) => {
    dispatch(setShowOnSale(checked));
    setCurrentPage(1);
    
    // Fetch products with updated sale filter
    dispatch(fetchProducts({
      category: activeCategory || undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: checked,
      minDiscountPercentage: checked ? minDiscountPercentage : undefined
    }));
  };
  
  const handleDiscountChange = (value: number[]) => {
    dispatch(setMinDiscountPercentage(value[0]));
    setCurrentPage(1);
    
    // Fetch products with updated discount percentage
    dispatch(fetchProducts({
      category: activeCategory || undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: true,
      minDiscountPercentage: value[0]
    }));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
    
    // Clear URL parameters and fetch all products
    navigate({ search: '' }, { replace: true });
    dispatch(fetchProducts({}));
  };
  
  const hasActiveFilters = activeCategory || 
    priceRange[0] > minPrice || 
    priceRange[1] < maxPrice || 
    showOnSale;
  
  return (
    <Card className="sticky top-24">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <h3 className="font-medium text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={handleClearFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        {/* Categories */}
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge 
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Badge>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">No categories found</p>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Price Range */}
        <div>
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Price Range</h4>
            <span className="text-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          
          <Slider
            defaultValue={[minPrice, maxPrice]}
            min={minPrice}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceChangeCommit}
            className="mb-2"
          />
        </div>
        
        <Separator />
        
        {/* Sale Items */}
        <div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">On Sale</h4>
              <p className="text-xs text-muted-foreground">
                Show discounted items only
              </p>
            </div>
            <Switch
              checked={showOnSale}
              onCheckedChange={handleSaleToggle}
            />
          </div>
          
          {showOnSale && (
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <Label>Minimum Discount</Label>
                <span className="text-sm text-muted-foreground">
                  {minDiscountPercentage}%
                </span>
              </div>
              <Slider
                defaultValue={[0]}
                min={0}
                max={75}
                step={5}
                value={[minDiscountPercentage]}
                onValueChange={handleDiscountChange}
                className="mb-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
