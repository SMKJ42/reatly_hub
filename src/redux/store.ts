import { configureStore } from "@reduxjs/toolkit";
import singleFamilyReducer from "./slice/singleFamilySlice";
import counterReducer from "./slice/counterSlice";
import clientReducer from "./slice/clientSlice";

const store = configureStore({
  reducer: {
    singleFamily: singleFamilyReducer,
    counter: counterReducer,
    client: clientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
