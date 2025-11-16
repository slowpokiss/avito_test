import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adsParams, adsInterface } from "../interface/interface";

export interface MainSliceState {
  currListItems: adsInterface[];
  filtersParams: adsParams;
}

const initialState: MainSliceState = {
  currListItems: [],
  filtersParams: {
    page: 1,
    limit: 10,
    status: [],
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

const mainSlice = createSlice({
  name: "mainSlice",
  initialState,
  reducers: {
    updateCurrItems(state, action: PayloadAction<{ newItems: adsInterface[] }>) {
      state.currListItems = action.payload.newItems;
    },
    setFilters(state, action: PayloadAction<Partial<adsParams>>) {
      state.filtersParams = { ...state.filtersParams, ...action.payload };
    },
    resetFilters(state) {
      state.filtersParams = { ...initialState.filtersParams };
    },
  },
});

export const { updateCurrItems, setFilters, resetFilters } = mainSlice.actions;
export default mainSlice.reducer;
