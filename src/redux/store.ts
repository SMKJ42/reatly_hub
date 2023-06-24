import { configureStore } from "@reduxjs/toolkit";
import SFHReducer from "./slice/SFHSlice";
import counterReducer from "./slice/counterSlice";
import clientReducer from "./slice/clientSlice";

const store = configureStore({
  reducer: {
    SFH: SFHReducer,
    counter: counterReducer,
    client: clientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
