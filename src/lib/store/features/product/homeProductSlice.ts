import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store/store";

// Define a type for the slice state
interface HomeProductState {
  data: Array<any>;
}

// Define the initial state using that type
const initialState: HomeProductState = {
  data: [],
};

export const homeProductSlice = createSlice({
  name: "homeProducts",
  initialState,
  reducers: {
    setHomeProducts(state, action) {
      state.data = action.payload?.resultList;
    },
  },
});

export const { setHomeProducts } = homeProductSlice.actions;

export default homeProductSlice.reducer;
