
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

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<string | null>) => {
      state.activeCategory = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      state.filteredProducts = state.products.filter(product => {
        // Apply all active filters (category, price range, search)
        const matchesCategory = !state.activeCategory || product.category === state.activeCategory;
        const matchesPrice = product.price >= state.priceRange[0] && product.price <= state.priceRange[1];
        const matchesSearch = !state.searchQuery || 
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        
        return matchesCategory && matchesPrice && matchesSearch;
      });
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.activeCategory = null;
      state.priceRange = [state.minPrice, state.maxPrice];
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
        state.filteredProducts = action.payload;
        
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

export const { setSearchQuery, setActiveCategory, setPriceRange, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
