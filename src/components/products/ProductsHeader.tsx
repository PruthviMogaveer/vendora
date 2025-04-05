
import React from 'react';
import { useAppSelector } from '@/hooks';
import { Badge } from '@/components/ui/badge';
import { Tag, BadgePercent } from 'lucide-react';

interface ProductsHeaderProps {
  categoryNames: Record<string, string>;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({ categoryNames }) => {
  const { 
    activeCategories,
    showOnSale,
    minDiscountPercentage
  } = useAppSelector(state => state.products);

  return (
    <div className="text-center mb-8 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
        {activeCategories.length === 1 
          ? `${categoryNames[activeCategories[0]] || activeCategories[0].charAt(0).toUpperCase() + activeCategories[0].slice(1)} Products` 
          : 'Our Collection'}
      </h1>
      <p className="text-primary/80 max-w-2xl mx-auto">
        {activeCategories.length === 1
          ? `Browse our selection of ${(categoryNames[activeCategories[0]] || activeCategories[0]).toLowerCase()} products, designed with quality and value in mind.`
          : 'Explore our curated selection of premium products, designed with attention to every detail and crafted with the finest materials.'}
      </p>
      
      {/* Active filters display */}
      <div className="flex justify-center mt-6 animate-slide-up gap-2 flex-wrap">
        {activeCategories.length > 0 && activeCategories.map(category => (
          <Badge 
            key={category} 
            variant="outline" 
            className="flex items-center gap-1 px-3 py-1"
          >
            <Tag size={14} className="mr-1" />
            Category: {categoryNames[category] || (category.charAt(0).toUpperCase() + category.slice(1))}
          </Badge>
        ))}
        
        {showOnSale && (
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <BadgePercent size={14} />
            {minDiscountPercentage > 0 ? 
              `Discount ${minDiscountPercentage}% or more` : 
              'On Sale Items'}
          </Badge>
        )}
      </div>
    </div>
  );
};
