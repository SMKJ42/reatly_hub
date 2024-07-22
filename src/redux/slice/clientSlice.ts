import { createSlice } from "@reduxjs/toolkit";

export interface ClientState {
  colorTheme: string;
}

const initialState: ClientState = {
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
