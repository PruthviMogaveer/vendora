import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setActiveCategory, fetchProducts } from '@/store/slices/productsSlice';
import { useCategories } from '@/hooks';

interface CategoryFilterProps {
  setCurrentPage: (page: number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ setCurrentPage }) => {
  const { 
    activeCategory,
    priceRange,
    showOnSale,
    minDiscountPercentage,
    searchQuery,
    categories: reduxCategories
  } = useAppSelector(state => state.products);
  
  // Fetch all categories from the database
  const { data: dbCategories = [], isLoading: isCategoriesLoading } = useCategories();
  
  // Merge categories from Redux and database
  const allCategories = [...new Set([...reduxCategories, ...dbCategories.map(cat => cat.slug)])];
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
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
  
  return (
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
  );
};
