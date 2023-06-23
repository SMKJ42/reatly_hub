import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import getLocalStorageItem from "~/cache/localStorage/getLocalStorageItem";

export interface CounterState {
  colorTheme: string;
}

const initialState: CounterState = {
  colorTheme: "",
};

const clientState = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setDarkMode(state) {
      state.colorTheme = "dark";
    },
    setLightMode(state) {
      state.colorTheme = "";
    },
  },
});

export const { setDarkMode, setLightMode } = clientState.actions;

export default clientState.reducer;
