
import React, { useEffect } from 'react';
import { HomeLayout } from '@/components/home/HomeLayout';
import { useCategories } from '@/hooks/useCategories';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@/services/categoryService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Default categories to use when none are found in the database
const defaultCategories = [
  { id: "1", name: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'electronics' },
  { id: "2", name: 'Clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'clothing' },
  { id: "3", name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'home' },
  { id: "4", name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'beauty' },
  { id: "5", name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'sports' },
  { id: "6", name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'books' },
  { id: "7", name: 'Toys', image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'toys' },
  { id: "8", name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', slug: 'jewelry' }
];

const Categories = () => {
  const { 
    data: dbCategories = [], 
    isLoading, 
    error, 
    refetch,
    isRefetching
  } = useCategories();
  
  // Use database categories if available, otherwise use default categories
  const categories = dbCategories.length > 0 ? dbCategories : defaultCategories;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Log data for debugging
    console.log('Categories component mounted, data:', categories);
  }, [categories]);
  
  return (
    <HomeLayout>
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Shop by Category
          </h1>
          <p className="text-primary/80 max-w-2xl mx-auto">
            Browse our collections organized by category to find exactly what you're looking for
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load categories. Please try again.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()} 
                disabled={isRefetching}
                className="ml-4"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="aspect-square mb-2 rounded-xl" />
                <Skeleton className="h-4 w-3/4 mb-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category: Category, index) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-medium text-lg">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Categories;
