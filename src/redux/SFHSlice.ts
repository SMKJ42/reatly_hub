import { createSlice } from "@reduxjs/toolkit";
import { convertToNum, strNumsInput } from "../homeBrews/numberDisplay";
import {
  calcMortgagePayment,
  convertDecimalToPercent,
  convertPercentToDecimal,
} from "../homeBrews/calculations";

export interface SFHInterface {
  address: string;
  price: string;
  interest: string;
  interestPercent: string;
  downPaymentPerc: string;
  downPaymentDoll: string;
  closingCostsPerc: string;
  closingCostsDoll: string;
  loanTerm: string;
  loanType: string;
  loanTyeOptions: string[];
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
}

const initialState: SFHInterface = {
  address: "",
  price: "100,000",
  interest: "5",
  interestPercent: "0.05",
  downPaymentPerc: "20",
  downPaymentDoll: "20,000",
  closingCostsPerc: "3.5",
  closingCostsDoll: "3,500",
  loanTerm: "30",
  loanType: "conventional",
  loanTyeOptions: ["conventional", "FHA", "VA", "USDA"],
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
  aquisitionCosts: "0",
  equity: "0",
  LTV: "0",
  mortgagePayment: "0",
  cashFlow: "0",
  expenses: "0",
  monthlyPayment: "0",
  cashOnCash: "0",
  rennoEquity: "0",
  rennoReturn: "0",
  closingCosts: "0",
  capRate: "0",
  ROE: "0",
  ROI: "0",
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
      const downPayment = convertToNum(state.downPaymentPerc);
      const ARV = convertToNum(state.ARV);
      const repairs = convertToNum(state.repairs);
      const rennovations = convertToNum(state.rennovations);
      const closingCosts = convertToNum(state.closingCostsPerc);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm);

      console.log(price, downPayment, ARV, repairs, rennovations, closingCosts);

      const loanBalance = price - (downPayment / 100) * price;
      const totalAquisitionReturn =
        ARV === 0
          ? strNumsInput(price - price - repairs - rennovations, 2)
          : strNumsInput(ARV - price - repairs - rennovations, 2);
      const aquisitionCosts = strNumsInput(
        (downPayment / 100) * price + closingCosts + repairs + rennovations,
        2
      );
      const equity = strNumsInput(price - loanBalance, 2);
      const LTV = strNumsInput(loanBalance / price, 3);
      const mortgagePayment = strNumsInput(
        calcMortgagePayment(loanBalance, interest, loanTerm),
        2
      );

      console.log(price, loanBalance);

      console.log(
        "loan balance: ",
        loanBalance,
        "TAR: ",
        totalAquisitionReturn,
        "AC: ",
        aquisitionCosts,
        "equity: ",
        equity,
        "ltv: ",
        LTV,
        "mortgage payment: ",
        mortgagePayment
      );

      return {
        ...state,
        price: action.payload,
        loanBalance: strNumsInput(loanBalance, 2),
        totalAquisitionReturn,
        aquisitionCosts,
        equity,
        LTV,
        mortgagePayment,
      };
    },

    updateInterest: (state, action: { payload: string }) => {
      const interest = convertToNum(action.payload);
      const loanBalance = convertToNum(state.loanBalance);
      const loanTerm = convertToNum(state.loanTerm);

      //TODO: turn into comma parsed string.
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
      const downPayment = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm);

      const downPaymentDoll = convertPercentToDecimal(downPayment, price);

      const loanBalance = price - (downPayment / 100) * price;

      //TODO: turn into comma parsed string.
      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      ).toString();
      console.log("redux mortgage payment", mortgagePayment);
      return {
        ...state,
        downPaymentPerc: action.payload,
        downPaymentDoll: downPaymentDoll,
        mortgagePayment,
      };
    },

    updateDownPaymentDoll: (state, action: { payload: string }) => {
      const downPayment = convertToNum(action.payload);
      const price = convertToNum(state.price);
      const interest = convertToNum(state.interest) / 100;
      const loanTerm = convertToNum(state.loanTerm);

      const downPaymentPerc = convertDecimalToPercent(downPayment, price);

      const loanBalance = price - (downPayment / 100) * price;

      //TODO: turn into comma parsed string.
      const mortgagePayment = calcMortgagePayment(
        loanBalance,
        interest,
        loanTerm
      ).toString();

      return {
        ...state,
        downPaymentDoll: action.payload,
        downPaymentPerc: downPaymentPerc,
        mortgagePayment,
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
      return { ...state, rennovationsRadio: action.payload, rennovations: "0" };
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

      console.log(
        taxes,
        insurance,
        hoa,
        vacancy,
        capEx,
        maintenance,
        management,
        expOther,
        mortgagePayment
      );

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      const monthlyPayment = strNumsInput(
        mortgagePayment + taxes + insurance + hoa
      );
      return { ...state, taxes: action.payload, expenses, monthlyPayment };
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

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      const monthlyPayment = strNumsInput(
        mortgagePayment + taxes + insurance + hoa
      );
      return { ...state, insurance: action.payload, expenses, monthlyPayment };
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

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      const monthlyPayment = strNumsInput(
        mortgagePayment + taxes + insurance + hoa
      );
      return { ...state, hoa: action.payload, expenses, monthlyPayment };
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

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      return { ...state, vacancy: action.payload, expenses };
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

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      return { ...state, capEx: action.payload, expenses };
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

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      return { ...state, maintenance: action.payload, expenses };
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

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      return { ...state, management: action.payload, expenses };
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

      const expenses = strNumsInput(
        taxes +
          insurance +
          hoa +
          vacancy +
          capEx +
          maintenance +
          management +
          expOther +
          mortgagePayment
      );
      return { ...state, expOther: action.payload, expenses };
    },

    updateRents: (state, action: { payload: string }) => {
      const rents = convertToNum(action.payload);
      const incOther = convertToNum(state.incOther);
      const expenses = convertToNum(state.expenses);

      const cashFlow = strNumsInput(rents + incOther - expenses);

      return { ...state, rents: action.payload, cashFlow };
    },

    updateIncOther: (state, action: { payload: string }) => {
      const incOther = convertToNum(action.payload);
      const expenses = convertToNum(state.expenses);
      const rents = convertToNum(state.rents);

      const cashFlow = strNumsInput(rents + incOther - expenses);

      return { ...state, incOther: action.payload, cashFlow };
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
