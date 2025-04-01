
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getProducts, getFeaturedProducts, getProductsByCategory } from '@/services/productService';
import { Product } from '@/types/product';

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeCategory: string | null;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  showOnSale: boolean;
  minDiscountPercentage: number;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  categories: [],
  loading: false,
  error: null,
  searchQuery: '',
  activeCategory: null,
  priceRange: [0, 1000],
  minPrice: 0,
  maxPrice: 1000,
  showOnSale: false,
  minDiscountPercentage: 0,
};

// Async thunks for backend operations
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ 
    searchQuery, 
    category 
  }: { 
    searchQuery?: string; 
    category?: string;
  }) => {
    return await getProducts(searchQuery, category);
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async () => {
    return await getFeaturedProducts();
  }
);

// Helper function to calculate discount percentage
const getDiscountPercentage = (product: Product): number => {
  if (!product.old_price || product.old_price <= product.price) return 0;
  return Math.round(((product.old_price - product.price) / product.old_price) * 100);
};

// Helper function to apply all filters
const applyFilters = (state: ProductsState) => {
  state.filteredProducts = state.products.filter(product => {
    // Match category
    const matchesCategory = !state.activeCategory || product.category === state.activeCategory;
    
    // Match price range
    const matchesPrice = product.price >= state.priceRange[0] && product.price <= state.priceRange[1];
    
    // Match search query
    const matchesSearch = !state.searchQuery || 
      product.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    // Match sale filter
    let matchesSale = true;
    if (state.showOnSale) {
      const discountPercentage = getDiscountPercentage(product);
      matchesSale = discountPercentage >= state.minDiscountPercentage;
    }
    
    return matchesCategory && matchesPrice && matchesSearch && matchesSale;
  });
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyFilters(state);
    },
    setActiveCategory: (state, action: PayloadAction<string | null>) => {
      state.activeCategory = action.payload;
      // Filtering will be done by fetchProducts
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      applyFilters(state);
    },
    setShowOnSale: (state, action: PayloadAction<boolean>) => {
      state.showOnSale = action.payload;
      applyFilters(state);
    },
    setMinDiscountPercentage: (state, action: PayloadAction<number>) => {
      state.minDiscountPercentage = action.payload;
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.activeCategory = null;
      state.priceRange = [state.minPrice, state.maxPrice];
      state.showOnSale = false;
      state.minDiscountPercentage = 0;
      state.filteredProducts = state.products;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        
        // Apply all active filters
        applyFilters(state);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(action.payload.map(product => product.category))];
        state.categories = uniqueCategories;
        
        // Calculate min and max prices for the range slider
        if (action.payload.length > 0) {
          const prices = action.payload.map(product => product.price);
          state.minPrice = Math.floor(Math.min(...prices));
          state.maxPrice = Math.ceil(Math.max(...prices));
          state.priceRange = [state.minPrice, state.maxPrice];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        // Only update featured products, don't change the main product list
        // This is used for the home page
      });
  },
});

export const { 
  setSearchQuery, 
  setActiveCategory, 
  setPriceRange, 
  setShowOnSale,
  setMinDiscountPercentage,
  clearFilters 
} = productsSlice.actions;
export default productsSlice.reducer;
