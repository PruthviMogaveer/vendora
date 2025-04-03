
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getProducts, getFeaturedProducts } from '@/services/productService';
import { Product } from '@/types/product';

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeCategories: string[];
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
  activeCategories: [],
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
    categories,
    minPrice,
    maxPrice,
    showOnSale,
    minDiscountPercentage
  }: { 
    searchQuery?: string; 
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    showOnSale?: boolean;
    minDiscountPercentage?: number;
  }) => {
    return await getProducts({ 
      searchQuery, 
      categories,
      minPrice,
      maxPrice,
      showOnSale,
      minDiscountPercentage
    });
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
    setActiveCategories: (state, action: PayloadAction<string[]>) => {
      state.activeCategories = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.activeCategories.includes(category)) {
        state.activeCategories = state.activeCategories.filter(cat => cat !== category);
      } else {
        state.activeCategories = [...state.activeCategories, category];
      }
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setShowOnSale: (state, action: PayloadAction<boolean>) => {
      state.showOnSale = action.payload;
    },
    setMinDiscountPercentage: (state, action: PayloadAction<number>) => {
      state.minDiscountPercentage = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.activeCategories = [];
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
        state.filteredProducts = action.payload;
        
        // Extract unique categories
        const uniqueCategories = [...new Set(action.payload.map(product => product.category))];
        state.categories = uniqueCategories;
        
        // Calculate min and max prices for the range slider
        if (action.payload.length > 0) {
          const prices = action.payload.map(product => product.price);
          state.minPrice = Math.floor(Math.min(...prices));
          state.maxPrice = Math.ceil(Math.max(...prices));
          
          // Only update price range if it's the initial fetch
          if (state.priceRange[0] === 0 && state.priceRange[1] === 1000) {
            state.priceRange = [state.minPrice, state.maxPrice];
          }
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
  setActiveCategories,
  toggleCategory, 
  setPriceRange, 
  setShowOnSale,
  setMinDiscountPercentage,
  clearFilters 
} = productsSlice.actions;
export default productsSlice.reducer;
