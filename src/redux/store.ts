import { Reducer, configureStore } from "@reduxjs/toolkit";
import SFHReducer from "./SFHSlice";

// export interface ReduxInterface {
//   SFH: SFHInterface;
// }

const store = configureStore({
  reducer: {
    SFH: SFHReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
