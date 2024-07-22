import { createSlice } from "@reduxjs/toolkit";
import { type ARMSchedule } from "~/lib/amortSchedules/sellerFinance";
import { strNumsInput } from "~/lib/numberDisplay";

interface SellerFinanceState {
  interest: number;
  loanAmount: number;
  loanTerm: number;
  interestOnlyPeriod: number;
  ARMSchedule: ARMSchedule;
  lumpSumPayments: { month: number; amount: number }[];
}

const initialState: SellerFinanceState = {
  interest: 5,
  loanAmount: 100000,
  loanTerm: 360,
  interestOnlyPeriod: 0,
  ARMSchedule: {
    first: 0,
    then: 0,
    firstMargin: 0,
    thenMargin: 0,
  },
  lumpSumPayments: [],
};

const OwnerFinanceSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setLoanAmount(state, action: { payload: string }) {
      return {
        ...state,
        loanAmount: parseFloat(action.payload),
      };
    },

    setInterest(state, action: { payload: string }) {
      return {
        ...state,
        interest: parseFloat(action.payload),
      };
    },

    setTerm(state, action: { payload: string }) {
      const term = strNumsInput(action.payload, 0);

      return {
        ...state,
        term: parseFloat(term),
      };
    },

    setInterestOnlyPeriod(state, action: { payload: string }) {
      return {
        ...state,
        interestOnlyPeriod: parseInt(action.payload),
      };
    },

    setARMFirst(state, action: { payload: string }) {
      return {
        ...state,
        ARMSchedule: {
          ...(state.ARMSchedule as ARMSchedule),
          first: parseFloat(action.payload),
        },
      };
    },

    setARMThen(state, action: { payload: string }) {
      return {
        ...state,
        ARMSchedule: {
          ...(state.ARMSchedule as ARMSchedule),
          then: parseFloat(action.payload),
        },
      };
    },

    setARMFirstMargin(state, action: { payload: string }) {
      const firstMargin = strNumsInput(action.payload, 3);

      return {
        ...state,
        ARMSchedule: {
          ...(state.ARMSchedule as ARMSchedule),
          firstMargin: parseFloat(action.payload),
        },
      };
    },

    setARMThenMargin(state, action: { payload: string }) {
      const thenMargin = strNumsInput(action.payload, 3);

      return {
        ...state,
        ARMSchedule: {
          ...(state.ARMSchedule as ARMSchedule),
          thenMargin: parseFloat(action.payload),
        },
      };
    },
    addLumpSumPayment(state) {
      return {
        ...state,
        lumpSumPayments: [...state.lumpSumPayments, { month: 0, amount: 0 }],
      };
    },
    removeLumpSumPayment(state, action: { payload: { idx: number } }) {
      return {
        ...state,
        lumpSumPayments: state.lumpSumPayments.filter(
          (_, idx) => idx !== action.payload.idx
        ),
      };
    },
    updateLumpSumPayment(
      state,
      action: { payload: { month: string; amount: string; idx: number } }
    ) {
      const lumpSumPayments = [...state.lumpSumPayments];
      lumpSumPayments[action.payload.idx] = {
        month: parseFloat(action.payload.month),
        amount: parseFloat(action.payload.amount),
      };

      return {
        ...state,
        lumpSumPayments,
      };
    },

    resetSellerFinance() {
      return {
        ...initialState,
      };
    },
  },
});

export const {
  setLoanAmount,
  setInterest,
  setTerm,
  setInterestOnlyPeriod,
  setARMFirst,
  setARMThen,
  setARMFirstMargin,
  setARMThenMargin,
  addLumpSumPayment,
  removeLumpSumPayment,
  updateLumpSumPayment,
  resetSellerFinance,
} = OwnerFinanceSlice.actions;

export default OwnerFinanceSlice.reducer;
