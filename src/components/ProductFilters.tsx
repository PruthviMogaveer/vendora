import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
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
import { useCategories } from '@/hooks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductFiltersProps {
  setCurrentPage: (page: number) => void;
}

export const ProductFilters = ({ setCurrentPage }: ProductFiltersProps) => {
  const { 
    categories: reduxCategories,
    activeCategory,
    priceRange,
    minPrice,
    maxPrice,
    showOnSale,
    minDiscountPercentage,
    searchQuery
  } = useAppSelector(state => state.products);
  
  // Fetch all categories from the database
  const { data: dbCategories = [], isLoading: isCategoriesLoading } = useCategories();
  
  // Merge categories from Redux and database
  const allCategories = [...new Set([...reduxCategories, ...dbCategories.map(cat => cat.slug)])];
  
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  
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
  
  // Group categories for better organization
  const categoryGroups = {
    electronics: ['electronics', 'phones', 'computers', 'accessories'],
    clothing: ['clothing', 'men', 'women', 'kids', 'shoes'],
    home: ['home', 'furniture', 'kitchen', 'decor'],
    beauty: ['beauty', 'skincare', 'makeup', 'haircare'],
    other: [] as string[]
  };
  
  // Put any categories that don't fit into the predefined groups into "other"
  allCategories.forEach(category => {
    if (!Object.values(categoryGroups).flat().includes(category)) {
      categoryGroups.other.push(category);
    }
  });
  
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
        {/* Categories Accordion */}
        <Accordion type="single" collapsible defaultValue="categories">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="font-medium">Categories</span>
            </AccordionTrigger>
            <AccordionContent>
              {isCategoriesLoading ? (
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4].map(i => (
                    <Badge key={i} variant="outline" className="bg-muted animate-pulse">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Badge>
                  ))}
                </div>
              ) : (
                <>
                  {/* Electronics Category Group */}
                  {categoryGroups.electronics.some(cat => allCategories.includes(cat)) && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2 text-muted-foreground">Electronics</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categoryGroups.electronics
                          .filter(cat => allCategories.includes(cat))
                          .map(category => (
                            <Badge 
                              key={category}
                              variant={activeCategory === category ? "default" : "outline"}
                              className="cursor-pointer capitalize"
                              onClick={() => handleCategoryClick(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Clothing Category Group */}
                  {categoryGroups.clothing.some(cat => allCategories.includes(cat)) && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2 text-muted-foreground">Clothing</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categoryGroups.clothing
                          .filter(cat => allCategories.includes(cat))
                          .map(category => (
                            <Badge 
                              key={category}
                              variant={activeCategory === category ? "default" : "outline"}
                              className="cursor-pointer capitalize"
                              onClick={() => handleCategoryClick(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Home Category Group */}
                  {categoryGroups.home.some(cat => allCategories.includes(cat)) && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2 text-muted-foreground">Home & Kitchen</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categoryGroups.home
                          .filter(cat => allCategories.includes(cat))
                          .map(category => (
                            <Badge 
                              key={category}
                              variant={activeCategory === category ? "default" : "outline"}
                              className="cursor-pointer capitalize"
                              onClick={() => handleCategoryClick(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Beauty Category Group */}
                  {categoryGroups.beauty.some(cat => allCategories.includes(cat)) && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2 text-muted-foreground">Beauty</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categoryGroups.beauty
                          .filter(cat => allCategories.includes(cat))
                          .map(category => (
                            <Badge 
                              key={category}
                              variant={activeCategory === category ? "default" : "outline"}
                              className="cursor-pointer capitalize"
                              onClick={() => handleCategoryClick(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Other Categories */}
                  {categoryGroups.other.length > 0 && (
                    <div className="mb-2">
                      <h5 className="text-sm font-medium mb-2 text-muted-foreground">Other</h5>
                      <div className="flex flex-wrap gap-2">
                        {categoryGroups.other.map(category => (
                          <Badge 
                            key={category}
                            variant={activeCategory === category ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show message if no categories are available */}
                  {allCategories.length === 0 && (
                    <p className="text-sm text-muted-foreground">No categories found</p>
                  )}
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
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
