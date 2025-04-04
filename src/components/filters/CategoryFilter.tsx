import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAppSelector } from '@/hooks';
import { useCategories } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';

interface CategoryFilterProps {
  setCurrentPage: (page: number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ setCurrentPage }) => {
  const { activeCategories } = useAppSelector(state => state.products);
  const { handleCategoryToggle } = useProductFilters({ setCurrentPage });
  
  // Fetch categories from Redux store
  const { categories: reduxCategories } = useAppSelector(state => state.products);
  
  // Fetch all categories from the database
  const { data: dbCategories = [], isLoading: isCategoriesLoading } = useCategories();
  
  // Merge categories from Redux and database
  const allCategories = [...new Set([...reduxCategories, ...dbCategories.map(cat => cat.slug)])];
  
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
                          variant={activeCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => handleCategoryToggle(category)}
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
                          variant={activeCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => handleCategoryToggle(category)}
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
                          variant={activeCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => handleCategoryToggle(category)}
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
                          variant={activeCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => handleCategoryToggle(category)}
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
                        variant={activeCategories.includes(category) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => handleCategoryToggle(category)}
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
