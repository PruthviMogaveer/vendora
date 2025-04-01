
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
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  categories: [],
  loading: false,
  error: null,
  searchQuery: '',
  activeCategory: null,
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
    clearFilters: (state) => {
      state.searchQuery = '';
      state.activeCategory = null;
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

export const { setSearchQuery, setActiveCategory, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
