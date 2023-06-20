import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface AuthState {
  authState: boolean;
}

const initialState: AuthState = {
  authState: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state: AuthState, action: { payload: boolean }) {
      state.authState = action.payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;

export const authState = (state: AuthState) => state.authState;

export default authSlice.reducer;
