import { createSlice } from "@reduxjs/toolkit";
import { convertToNum, strNumsInput } from "../../lib/numberDisplay";
import {
  convertDecimalToPercent,
  convertPercentToDecimal,
} from "../../lib/calculations";
import { type mortgageRates } from "@prisma/client";
import { calcMortgagePayment } from "~/lib/amortSchedules/core";
import { type singleFamilyInterface } from "~/server/types/redux";
import { setInterest } from "./SellerFinanceSlice";

const initialState: singleFamilyInterface = {
  id: false,
  address: "",
  price: "100,000",
  interest: "5",
  downPaymentPerc: "20",
  downPaymentDoll: "20,000",
  closingCostsPerc: "3.5",
  closingCostsDoll: "3,500",
  loanTerm: "30",
  loanType: "conventional",
  // loanTypeOptions: ["conventional", "FHA", "VA", "USDA"],

  repairs: "0",
  ARV: "0",
  taxes: "0",
  insurance: "0",
  hoa: "0",
  vacancy: "0",
  capEx: "0",
  rennovationsRadio: false,
  rennovations: "0",
  maintenance: "0",
  management: "0",
  expOther: "0",
  rents: "0",
  incOther: "0",
  speculation: false,
  appreciation: "0",
  loanBalance: "80,000",
  costOfRenno: "0",
  totalAquisitionReturn: "0",
  aquisitionCosts: "23,500",
  equity: "20,000",
  LTV: "0.800",
  mortgagePayment: "429.46",
  cashFlow: "0",
  expenses: "429.46",
  monthlyPayment: "429.46",
  cashOnCash: "0",
  rennoEquity: "0",
  rennoReturn: "0",
  closingCosts: "0",
  capRate: "0",
  ROE: "0",
  ROI: "0",
  fixed: "0",
  variable: "0",
};

export const singleFamilySlice = createSlice({
  name: "SFH",
  initialState,
  reducers: {
    resetSFH: () => {
      return initialState;
    },
    HydrateSingleFamily: (
      state,
      action: { payload: singleFamilyInterface }
    ) => {
      setInterest(action.payload.interest);
      return { ...action.payload };
    },
    updateId: (state, action: { payload: string }) => {
      return { ...state, id: action.payload };
    },
    updateAddress: (state, action: { payload: string }) => {
      return { ...state, address: action.payload };
    },
    updateLoanTypeOptions: (state, action: { payload: mortgageRates[] }) => {
      return { ...state, loanTypeOptions: action.payload };
    },
    updatePrice: (state, action: { payload: string }) => {
      const price = convertToNum(action.payload);
      const ARV = convertToNum(state.ARV);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const closingCostsPerc = convertToNum(state.closingCostsPerc);
      const closingCostsDoll = price * (closingCostsPerc / 100);
      const downPaymentPerc = convertToNum(state.downPaymentPerc);
      const downPaymentDoll = price * (downPaymentPerc / 100);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm) * 12;
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);

      const loanBalance = price - downPaymentDoll;

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      );

      const totalAquisitionReturn =
        ARV === 0
          ? price - price - repairs - rennovations
          : ARV - price - repairs - rennovations;

      const aquisitionCosts =
        downPaymentDoll + closingCostsDoll + repairs + rennovations;

      const monthlyPayment = mortgagePayment + taxes + insurance + hoa;

      const equity = price - loanBalance;
      const LTV = loanBalance / price;

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        downPaymentDoll: strNumsInput(downPaymentDoll, 2),
        price: action.payload,
        loanBalance: strNumsInput(loanBalance, 2),
        totalAquisitionReturn: strNumsInput(totalAquisitionReturn, 2),
        aquisitionCosts: strNumsInput(aquisitionCosts, 2),
        closingCostsDoll: strNumsInput(closingCostsDoll, 2),
        equity: strNumsInput(equity, 2),
        LTV: strNumsInput(LTV, 3),
        mortgagePayment: strNumsInput(mortgagePayment, 2),
        monthlyPayment: strNumsInput(monthlyPayment, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
        expenses: strNumsInput(expenses, 2),
      };
    },

    updateInterest: (state, action: { payload: string }) => {
      const interest = convertToNum(action.payload) / 100;
      const loanBalance = convertToNum(state.loanBalance);
      const loanTerm = convertToNum(state.loanTerm) * 12;
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      );

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const monthlyPayment = mortgagePayment + taxes + insurance + hoa;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        interest: action.payload,
        mortgagePayment: strNumsInput(mortgagePayment, 2),
        monthlyPayment: strNumsInput(monthlyPayment, 2),
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 3),
        ROE: strNumsInput(ROE, 3),
        ROI: strNumsInput(ROI, 3),
      };
    },

    updateDownPaymentPerc: (state, action: { payload: string }) => {
      const downPaymentPerc = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm) * 12;
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const closingCostsDoll = convertToNum(state.closingCostsDoll);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);

      const downPaymentDoll = convertPercentToDecimal(downPaymentPerc, price);

      const loanBalance = price - (downPaymentPerc / 100) * price;

      const LTV = loanBalance / price;

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      );

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const monthlyPayment = mortgagePayment + taxes + insurance + hoa;

      const aquisitionCosts =
        downPaymentDoll + closingCostsDoll + repairs + rennovations;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        downPaymentPerc: strNumsInput(downPaymentPerc, 2),
        downPaymentDoll: strNumsInput(downPaymentDoll),
        mortgagePayment: strNumsInput(mortgagePayment, 2),
        loanBalance: strNumsInput(loanBalance, 2),
        LTV: strNumsInput(LTV, 3),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
        monthlyPayment: strNumsInput(monthlyPayment, 2),
        aquisitionCosts: strNumsInput(aquisitionCosts, 2),
      };
    },

    updateDownPaymentDoll: (state, action: { payload: string }) => {
      const downPayment = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm) * 12;
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const closingCostsDoll = convertToNum(state.closingCostsDoll);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const downPaymentDoll = convertToNum(state.downPaymentDoll);

      const downPaymentPerc = convertDecimalToPercent(downPayment, price);

      const loanBalance = price - downPayment;
      const LTV = loanBalance / price;

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      );

      const monthlyPayment = mortgagePayment + taxes + insurance + hoa;

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const aquisitionCosts =
        downPaymentDoll + closingCostsDoll + repairs + rennovations;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        downPaymentDoll: action.payload,
        downPaymentPerc: strNumsInput(downPaymentPerc, 2),
        mortgagePayment: strNumsInput(mortgagePayment, 2),
        loanBalance: strNumsInput(loanBalance, 2),
        LTV: strNumsInput(LTV, 3),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
        monthlyPayment: strNumsInput(monthlyPayment, 2),
        aquisitionCosts: strNumsInput(aquisitionCosts, 2),
      };
    },

    updateClosingCostsPerc: (state, action: { payload: string }) => {
      const closingCosts = convertToNum(action.payload);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const price = convertToNum(state.price);
      const downPaymentDoll = convertToNum(state.downPaymentDoll);

      const closingCostsDoll = convertPercentToDecimal(closingCosts, price);

      const costOfRenno = strNumsInput(repairs + rennovations + closingCosts);
      //
      const aquisitionCosts = strNumsInput(
        downPaymentDoll + (price * closingCosts) / 100 + repairs + rennovations
      );

      return {
        ...state,
        closingCostsPerc: action.payload,
        closingCostsDoll: strNumsInput(closingCostsDoll, 2),
        costOfRenno,
        aquisitionCosts,
      };
    },

    updateClosingCostsDoll: (state, action: { payload: string }) => {
      const closingCosts = convertToNum(action.payload);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const price = convertToNum(state.price);
      const downPayment = convertToNum(state.downPaymentDoll);

      const costOfRenno = strNumsInput(repairs + rennovations + closingCosts);

      const closingCostsPerc = convertDecimalToPercent(closingCosts, price);

      const aquisitionCosts = strNumsInput(
        (downPayment / 100) * price + closingCosts + repairs + rennovations
      );
      return {
        ...state,
        closingCostsDoll: action.payload,
        closingCostsPerc: strNumsInput(closingCostsPerc),
        costOfRenno,
        aquisitionCosts,
      };
    },

    updateLoanTerm: (state, action: { payload: string }) => {
      const loanTerm = convertToNum(action.payload) * 12;
      const loanBalance = convertToNum(state.loanBalance);
      const interest = convertToNum(state.interest) / 100;
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      );

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const monthlyPayment = mortgagePayment + taxes + insurance + hoa;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        loanTerm: action.payload,
        mortgagePayment: strNumsInput(mortgagePayment, 2),
        monthlyPayment: strNumsInput(monthlyPayment, 2),
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateLoanType: (state, action: { payload: string }) => {
      return { ...state, loanType: action.payload };
    },

    updateRepairs: (state, action: { payload: string }) => {
      const repairs = convertToNum(action.payload);
      const rennovations = convertToNum(state.rennovations);
      const closingCosts = convertToNum(state.closingCostsPerc);
      const price = convertToNum(state.price);
      const downPayment = convertToNum(state.downPaymentDoll);
      const ARV = convertToNum(state.ARV);
      const cashFlow = convertToNum(state.cashFlow);

      const costOfRenno = strNumsInput(repairs + rennovations + closingCosts);
      //
      const totalAquisitionReturn =
        ARV === 0
          ? strNumsInput(price - price - repairs - rennovations)
          : strNumsInput(ARV - price - repairs - rennovations);
      //
      const aquisitionCosts =
        downPayment + (price * closingCosts) / 100 + repairs + rennovations;
      //
      const cashOnCash = strNumsInput(
        (cashFlow / (aquisitionCosts + repairs)) * 100
      );
      return {
        ...state,
        repairs: action.payload,
        costOfRenno,
        totalAquisitionReturn,
        aquisitionCosts: strNumsInput(aquisitionCosts),
        cashOnCash,
      };
    },

    updateRennovationsRadio: (state, action: { payload: boolean }) => {
      return { ...state, rennovationsRadio: action.payload };
    },

    updateRennovations: (state, action: { payload: string }) => {
      const rennovations = convertToNum(action.payload);
      const repairs = convertToNum(state.repairs);
      const closingCosts = convertToNum(state.closingCostsDoll);
      const price = convertToNum(state.price);
      const downPayment = convertToNum(state.downPaymentDoll);
      const ARV = convertToNum(state.ARV);

      const costOfRenno = strNumsInput(repairs + rennovations + closingCosts);
      //
      const totalAquisitionReturn =
        ARV === 0
          ? strNumsInput(price - price - repairs - rennovations)
          : strNumsInput(ARV - price - repairs - rennovations);
      //
      const aquisitionCosts =
        downPayment + closingCosts + repairs + rennovations;

      const _rennovations = strNumsInput(rennovations);

      return {
        ...state,
        rennovations: _rennovations[0] ? _rennovations : "0",
        costOfRenno,
        totalAquisitionReturn,
        aquisitionCosts: strNumsInput(aquisitionCosts),
      };
    },

    updateARV: (state, action: { payload: string }) => {
      const ARV = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const loanBalance = convertToNum(state.loanBalance);
      const costOfRenno = convertToNum(state.costOfRenno);

      const rennoEquity = ARV - costOfRenno - loanBalance;
      //
      const rennoReturn = ARV - costOfRenno;
      //
      const totalAquisitionReturn =
        ARV === 0
          ? price - price - repairs - rennovations
          : ARV - price - repairs - rennovations;

      return {
        ...state,
        ARV: action.payload,
        rennoEquity: strNumsInput(rennoEquity, 2),
        rennoReturn: strNumsInput(rennoReturn, 2),
        totalAquisitionReturn: strNumsInput(totalAquisitionReturn, 2),
      };
    },

    updateTaxes: (state, action: { payload: string }) => {
      const taxes = convertToNum(action.payload);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;
      const monthlyPayment = mortgagePayment + taxes + insurance + hoa;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        taxes: action.payload,
        expenses: strNumsInput(expenses, 2),
        monthlyPayment: strNumsInput(monthlyPayment, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateInsurance: (state, action: { payload: string }) => {
      const insurance = convertToNum(action.payload);
      const taxes = convertToNum(state.taxes);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;
      const monthlyPayment = mortgagePayment + taxes + insurance + hoa;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        insurance: action.payload,
        expenses: strNumsInput(expenses, 2),
        monthlyPayment: strNumsInput(monthlyPayment, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateHOA: (state, action: { payload: string }) => {
      const hoa = convertToNum(action.payload);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        hoa: action.payload,
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateVacancy: (state, action: { payload: string }) => {
      const vacancy = convertToNum(action.payload);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        vacancy: action.payload,
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateCapex: (state, action: { payload: string }) => {
      const capEx = convertToNum(action.payload);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        capEx: action.payload,
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateMaintenance: (state, action: { payload: string }) => {
      const maintenance = convertToNum(action.payload);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const management = convertToNum(state.management);
      const expOther = convertToNum(state.expOther);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        maintenance: action.payload,
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateManagement: (state, action: { payload: string }) => {
      const management = convertToNum(action.payload);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const expOther = convertToNum(state.expOther);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        management: action.payload,
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateExpOther: (state, action: { payload: string }) => {
      const expOther = convertToNum(action.payload);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);
      const vacancy = convertToNum(state.vacancy);
      const capEx = convertToNum(state.capEx);
      const maintenance = convertToNum(state.maintenance);
      const management = convertToNum(state.management);
      const mortgagePayment = convertToNum(state.mortgagePayment);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);

      const expenses =
        taxes +
        insurance +
        hoa +
        vacancy +
        capEx +
        maintenance +
        management +
        expOther +
        mortgagePayment;

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        expOther: action.payload,
        expenses: strNumsInput(expenses, 2),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateRents: (state, action: { payload: string }) => {
      const rents = convertToNum(action.payload);
      const incOther = convertToNum(state.incOther);
      const expenses = convertToNum(state.expenses);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);
      const mortgagePayment = convertToNum(state.mortgagePayment);

      const cashFlow = rents + incOther - expenses;

      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        rents: action.payload,
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateIncOther: (state, action: { payload: string }) => {
      const incOther = convertToNum(action.payload);
      const expenses = convertToNum(state.expenses);
      const rents = convertToNum(state.rents);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);
      const price = convertToNum(state.price);
      const mortgagePayment = convertToNum(state.mortgagePayment);

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 1200) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        incOther: action.payload,
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },
  },
});

export const {
  resetSFH,
  HydrateSingleFamily,
  updateId,
  updateAddress,
  updateLoanTypeOptions,
  updatePrice,
  updateInterest,
  updateDownPaymentPerc,
  updateDownPaymentDoll,
  updateClosingCostsPerc,
  updateClosingCostsDoll,
  updateLoanTerm,
  updateLoanType,
  updateRepairs,
  updateRennovationsRadio,
  updateRennovations,
  updateARV,
  updateTaxes,
  updateInsurance,
  updateHOA,
  updateVacancy,
  updateCapex,
  updateMaintenance,
  updateManagement,
  updateExpOther,
  updateRents,
  updateIncOther,
} = singleFamilySlice.actions;

export default singleFamilySlice.reducer;
