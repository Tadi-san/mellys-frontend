import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store/store";

// Define a type for the slice state
interface ProductState {
  data: Array<any>;
}

// Define the initial state using that type
const initialState: ProductState = {
  data: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.data = action.payload?.result?.resultList;
      let productList = JSON.stringify(current(state).data);
      localStorage.setItem("productList", productList);
    },
  },
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
