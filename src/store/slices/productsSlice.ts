
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
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
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
  sortBy: 'name',
  sortOrder: 'asc',
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 9
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
    minDiscountPercentage,
    sortBy,
    sortOrder,
    page,
    pageSize
  }: { 
    searchQuery?: string; 
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    showOnSale?: boolean;
    minDiscountPercentage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }) => {
    console.log('Fetching products with categories:', categories);
    console.log('Pagination:', page, pageSize);
    console.log('Sorting by:', sortBy, sortOrder);
    return await getProducts({ 
      searchQuery, 
      categories,
      minPrice,
      maxPrice,
      showOnSale,
      minDiscountPercentage,
      sortBy,
      sortOrder,
      page,
      pageSize
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
      // Filtering will now be done by fetchProducts
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.activeCategories.includes(action.payload)) {
        state.activeCategories = [...state.activeCategories, action.payload];
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.activeCategories = state.activeCategories.filter(
        category => category !== action.payload
      );
    },
    setActiveCategories: (state, action: PayloadAction<string[]>) => {
      state.activeCategories = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      // Filtering will be done by fetchProducts
    },
    setShowOnSale: (state, action: PayloadAction<boolean>) => {
      state.showOnSale = action.payload;
      // Filtering will be done by fetchProducts
    },
    setMinDiscountPercentage: (state, action: PayloadAction<number>) => {
      state.minDiscountPercentage = action.payload;
      // Filtering will be done by fetchProducts
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.activeCategories = [];
      state.priceRange = [state.minPrice, state.maxPrice];
      state.showOnSale = false;
      state.minDiscountPercentage = 0;
      state.sortBy = 'name';
      state.sortOrder = 'asc';
      state.currentPage = 1;
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
        state.products = action.payload.products;
        state.filteredProducts = action.payload.products;
        state.totalCount = action.payload.totalCount;
        state.totalPages = Math.ceil(action.payload.totalCount / state.pageSize);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(action.payload.products.map(product => product.category))];
        state.categories = uniqueCategories;
        
        // Calculate min and max prices for the range slider
        if (action.payload.products.length > 0) {
          const prices = action.payload.products.map(product => product.price);
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
  addCategory,
  removeCategory,
  setActiveCategories,
  setPriceRange, 
  setShowOnSale,
  setMinDiscountPercentage,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setPageSize,
  clearFilters 
} = productsSlice.actions;
export default productsSlice.reducer;
