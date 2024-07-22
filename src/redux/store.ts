import { configureStore } from "@reduxjs/toolkit";
import singleFamilyReducer from "./slice/singleFamilySlice";
import clientReducer from "./slice/clientSlice";
import sellerFinanceSlice from "./slice/SellerFinanceSlice";

const store = configureStore({
  reducer: {
    singleFamily: singleFamilyReducer,
    client: clientReducer,
    sellerFinance: sellerFinanceSlice,
  },
  devTools: true,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
