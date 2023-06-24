import { createSlice } from "@reduxjs/toolkit";
import { convertToNum, strNumsInput } from "../../homeBrews/numberDisplay";
import {
  calcMortgagePayment,
  convertDecimalToPercent,
  convertPercentToDecimal,
} from "../../homeBrews/calculations";

export interface SFHInterface {
  address: string;
  price: string;
  interest: string;
  downPaymentPerc: string;
  downPaymentDoll: string;
  closingCostsPerc: string;
  closingCostsDoll: string;
  loanTerm: string;
  loanType: string;
  loanTypeOptions: string[];
  repairs: string;
  ARV: string;
  taxes: string;
  insurance: string;
  hoa: string;
  vacancy: string;
  capEx: string;
  rennovationsRadio: boolean;
  rennovations: string;
  maintenance: string;
  management: string;
  expOther: string;
  rents: string;
  incOther: string;
  speculation: boolean;
  appreciation: string;
  loanBalance: string;
  costOfRenno: string;
  totalAquisitionReturn: string;
  aquisitionCosts: string;
  equity: string;
  LTV: string;
  mortgagePayment: string;
  cashFlow: string;
  expenses: string;
  monthlyPayment: string;
  cashOnCash: string;
  rennoEquity: string;
  rennoReturn: string;
  closingCosts: string;
  capRate: string;
  ROE: string;
  ROI: string;
  fixed: string;
  variable: string;
}

const initialState: SFHInterface = {
  address: "",
  price: "100,000",
  interest: "5",
  downPaymentPerc: "20",
  downPaymentDoll: "20,000",
  closingCostsPerc: "3.5",
  closingCostsDoll: "3,500",
  loanTerm: "30",
  loanType: "conventional",
  loanTypeOptions: ["conventional", "FHA", "VA", "USDA"],
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
  equity: "0",
  LTV: "0.8",
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

export const SFHSlice = createSlice({
  name: "SFH",
  initialState,
  reducers: {
    resetSFH: () => {
      return initialState;
    },
    updateAddress: (state, action: { payload: string }) => {
      return { ...state, address: action.payload };
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
      const loanTerm = convertToNum(state.loanTerm);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const expenses = convertToNum(state.expenses);
      const taxes = convertToNum(state.taxes);
      const insurance = convertToNum(state.insurance);
      const hoa = convertToNum(state.hoa);

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

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      };
    },

    updateInterest: (state, action: { payload: string }) => {
      const interest = convertToNum(action.payload);
      const loanBalance = convertToNum(state.loanBalance);
      const loanTerm = convertToNum(state.loanTerm);

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      ).toString();
      return {
        ...state,
        interest: action.payload,
        mortgagePayment: mortgagePayment,
      };
    },

    updateDownPaymentPerc: (state, action: { payload: string }) => {
      const downPaymentPerc = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm);

      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const expenses = convertToNum(state.expenses);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);

      const downPaymentDoll = convertPercentToDecimal(
        downPaymentPerc / 100,
        price
      );

      const loanBalance = price - (downPaymentPerc / 100) * price;

      const LTV = loanBalance / price;

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      );

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      };
    },

    updateDownPaymentDoll: (state, action: { payload: string }) => {
      const downPayment = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm);
      const rents = convertToNum(state.rents);
      const incOther = convertToNum(state.incOther);
      const expenses = convertToNum(state.expenses);
      const equity = convertToNum(state.equity);
      const aquisitionCosts = convertToNum(state.aquisitionCosts);

      const downPaymentPerc = convertDecimalToPercent(downPayment, price);

      const loanBalance = price - downPayment;
      const LTV = loanBalance / price;

      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      );

      const cashFlow = rents + incOther - expenses;
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
      const ROE = ((cashFlow * 12) / equity) * 100;
      const ROI = ((cashFlow * 12) / aquisitionCosts) * 100;

      return {
        ...state,
        downPaymentDoll: action.payload,
        downPaymentPerc: downPaymentPerc,
        mortgagePayment: strNumsInput(mortgagePayment, 2),
        loanBalance: strNumsInput(loanBalance, 2),
        LTV: strNumsInput(LTV, 3),
        cashFlow: strNumsInput(cashFlow, 2),
        capRate: strNumsInput(capRate, 2),
        ROE: strNumsInput(ROE, 2),
        ROI: strNumsInput(ROI, 2),
      };
    },

    updateClosingCostsPerc: (state, action: { payload: string }) => {
      const closingCosts = convertToNum(action.payload);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const price = convertToNum(state.price);
      const downPayment = convertToNum(state.downPaymentPerc);

      const costOfRenno = strNumsInput(repairs + rennovations + closingCosts);
      //
      const aquisitionCosts = strNumsInput(
        (downPayment / 100) * price + closingCosts + repairs + rennovations
      );

      const closingCostsDoll = convertPercentToDecimal(closingCosts, price);

      return {
        ...state,
        closingCostsPerc: action.payload,
        closingCostsDoll: closingCostsDoll,
        costOfRenno,
        aquisitionCosts,
      };
    },

    updateClosingCostsDoll: (state, action: { payload: string }) => {
      const closingCosts = convertToNum(action.payload);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const price = convertToNum(state.price);
      const downPayment = convertToNum(state.downPaymentPerc);

      const costOfRenno = strNumsInput(repairs + rennovations + closingCosts);

      const closingCostsPerc = convertDecimalToPercent(closingCosts, price);

      const aquisitionCosts = strNumsInput(
        (downPayment / 100) * price + closingCosts + repairs + rennovations
      );
      return {
        ...state,
        closingCostsDoll: action.payload,
        closingCostsPerc: closingCostsPerc,
        costOfRenno,
        aquisitionCosts,
      };
    },

    updateLoanTerm: (state, action: { payload: string }) => {
      const loanTerm = convertToNum(action.payload);
      const loanBalance = convertToNum(state.loanBalance);
      const interest = convertToNum(state.interest) / 100;

      const mortgagePayment = strNumsInput(
        calcMortgagePayment(loanBalance, interest, loanTerm)
      );
      return { ...state, loanTerm: action.payload, mortgagePayment };
    },

    updateLoanType: (state, action: { payload: string }) => {
      return { ...state, loanType: action.payload };
    },

    updateRepairs: (state, action: { payload: string }) => {
      const repairs = convertToNum(action.payload);
      const rennovations = convertToNum(state.rennovations);
      const closingCosts = convertToNum(state.closingCostsPerc);
      const price = convertToNum(state.price);
      const downPayment = convertToNum(state.downPaymentPerc);
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
        (downPayment / 100) * price + closingCosts + repairs + rennovations;
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
      const closingCosts = convertToNum(state.closingCostsPerc);
      const price = convertToNum(state.price);
      const downPayment = convertToNum(state.downPaymentPerc);
      const ARV = convertToNum(state.ARV);

      const costOfRenno = strNumsInput(repairs + rennovations + closingCosts);
      //
      const totalAquisitionReturn =
        ARV === 0
          ? strNumsInput(price - price - repairs - rennovations)
          : strNumsInput(ARV - price - repairs - rennovations);
      //
      const aquisitionCosts = strNumsInput(
        (downPayment / 100) * price + closingCosts + repairs + rennovations
      );

      const _rennovations = strNumsInput(rennovations);

      return {
        ...state,
        rennovations: _rennovations[0] ? _rennovations : "0",
        costOfRenno,
        totalAquisitionReturn,
        aquisitionCosts,
      };
    },

    updateARV: (state, action: { payload: string }) => {
      const ARV = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const loanBalance = convertToNum(state.loanBalance);
      const costOfRenno = convertToNum(state.costOfRenno);

      const rennoEquity = strNumsInput(ARV - costOfRenno - loanBalance);
      //
      const rennoReturn = strNumsInput(ARV - costOfRenno);
      //
      const totalAquisitionReturn =
        ARV === 0
          ? strNumsInput(price - price - repairs - rennovations)
          : strNumsInput(ARV - price - repairs - rennovations);

      return {
        ...state,
        ARV: action.payload,
        rennoEquity,
        rennoReturn,
        totalAquisitionReturn,
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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

      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
      const capRate = ((cashFlow + mortgagePayment) * 12) / price;
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
  updateAddress,
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
} = SFHSlice.actions;

export default SFHSlice.reducer;
