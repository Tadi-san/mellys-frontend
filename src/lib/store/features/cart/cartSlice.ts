import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store/store";

// Define a type for the slice state
interface CartState {
  data: Array<any>;
}

// Define the initial state using that type
const initialState: CartState = {
  data: [],
};

export const cartItemSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.data.push(action.payload);
      let cartItems = JSON.stringify(current(state).data);
      localStorage.setItem("cartItem", cartItems);
    },
    removeAllProductsFromCart(state) {
      state.data = [];
      localStorage.setItem("cartItem", JSON.stringify([]));
    },
    removeCartItem(state, action) {
      state.data = state.data.filter((item) => item.itemId !== action.payload);
      let cartItems = JSON.stringify(current(state).data);
      localStorage.setItem("cartItem", cartItems);
    },
  },
});

export const { setCartItems, removeAllProductsFromCart, removeCartItem } =
  cartItemSlice.actions;

export default cartItemSlice.reducer;
