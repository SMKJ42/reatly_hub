import { configureStore } from "@reduxjs/toolkit";
import SFHReducer from "./SFHSlice";
import counterReducer from "./counterSlice";

const store = configureStore({
  reducer: {
    SFH: SFHReducer,
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
