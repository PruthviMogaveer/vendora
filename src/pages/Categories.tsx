
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Categories = () => {
  const categories = [
    { 
      name: 'Electronics', 
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Smartphones', 'Laptops', 'Audio', 'Accessories'],
      path: '/products?category=electronics'
    },
    { 
      name: 'Clothing', 
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
      path: '/products?category=clothing'
    },
    { 
      name: 'Home & Kitchen', 
      image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Appliances', 'Furniture', 'Kitchenware', 'Decor'],
      path: '/products?category=home'
    },
    { 
      name: 'Beauty', 
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
      path: '/products?category=beauty'
    },
    { 
      name: 'Sports & Outdoors', 
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Fitness', 'Outdoor', 'Sports Equipment', 'Activewear'],
      path: '/products?category=sports'
    },
    { 
      name: 'Books & Media', 
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Books', 'Movies', 'Music', 'Games'],
      path: '/products?category=books'
    },
    { 
      name: 'Toys & Games', 
      image: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Toys', 'Games', 'Puzzles', 'Educational'],
      path: '/products?category=toys'
    },
    { 
      name: 'Automotive', 
      image: 'https://images.unsplash.com/photo-1617469735309-4b7e3d9ee186?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      subcategories: ['Parts', 'Tools', 'Accessories', 'Car Care'],
      path: '/products?category=automotive'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              All Categories
            </h1>
            <p className="text-primary/80 max-w-2xl mx-auto">
              Browse our wide selection of products across many categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={category.name}
                to={category.path}
                className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>{sub}</li>
                    ))}
                  </ul>
                  <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                    View All <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;
