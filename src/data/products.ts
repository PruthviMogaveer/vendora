
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Minimalist Ceramic Vase',
    description: 'Hand-crafted ceramic vase with a smooth matte finish. Perfect for minimal home decor, this piece adds elegance to any space.',
    price: 89.99,
    oldPrice: 119.99,
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612196808341-7e338291b1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612196808089-56f9178acf7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'home',
    badge: 'New',
    featured: true,
    inStock: true,
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: ['White', 'Sand', 'Black']
      }
    ]
  },
  {
    id: '2',
    name: 'Premium Leather Wallet',
    description: 'Crafted from full-grain leather with precision stitching. Features multiple card slots and a secure coin pocket.',
    price: 69.99,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627123424587-8b8c7b7a7c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627123424591-8b8c7b7a7c7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'accessories',
    featured: true,
    inStock: true,
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: ['Brown', 'Black', 'Tan']
      }
    ]
  },
  {
    id: '3',
    name: 'Wireless Premium Headphones',
    description: 'High-fidelity sound with active noise cancellation. Features premium materials and all-day battery life for uninterrupted listening.',
    price: 249.99,
    oldPrice: 299.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30g?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'electronics',
    badge: 'Sale',
    featured: true,
    inStock: true
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    description: 'Elegant desk lamp with adjustable brightness levels and color temperature. The sleek design complements any workspace.',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'home',
    featured: true,
    inStock: true
  },
  {
    id: '5',
    name: 'Wool Blend Coat',
    description: 'Tailored wool-blend coat with clean lines and a minimalist aesthetic. Features a smooth lining and deep pockets for practicality.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b544?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b545?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'clothing',
    inStock: true,
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: ['S', 'M', 'L', 'XL']
      },
      {
        id: 'color',
        name: 'Color',
        options: ['Black', 'Camel', 'Gray']
      }
    ]
  },
  {
    id: '6',
    name: 'Premium Coffee Maker',
    description: 'Precisely engineered coffee maker with temperature control and built-in grinder. Creates the perfect cup with minimal effort.',
    price: 159.99,
    oldPrice: 189.99,
    images: [
      'https://images.unsplash.com/photo-1517914309068-f8892fd4fbf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517914309068-f8892fd4fbfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517914309068-f8892fd4fbfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'kitchen',
    badge: 'Best Seller',
    inStock: true
  },
  {
    id: '7',
    name: 'Minimalist Watch',
    description: 'Clean, minimalist timepiece with a sapphire crystal face and premium leather strap. Water-resistant and built to last.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'accessories',
    featured: true,
    inStock: true,
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: ['Black/Black', 'Silver/Brown', 'Gold/Black']
      }
    ]
  },
  {
    id: '8',
    name: 'Handcrafted Wooden Bowl',
    description: 'Artisan-crafted wooden bowl made from sustainable hardwood. Each piece features unique grain patterns and a smooth, food-safe finish.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1578983427937-26078ee3d9d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578983427937-26078ee3d9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578983427937-26078ee3d9d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'home',
    inStock: true
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
