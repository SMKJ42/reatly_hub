// import {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useReducer,
// } from "react";
// import SFHContext from "./SFHContext";
// import { calcMortgagePayment } from "../../app/homeBrews/calculations";
// import { stripComma } from "../../app/homeBrews/numberDisplay";

// /*
//  * I'm sorry for this. Im ignorant and dont know how to do this better... maybe a
//  * homebrew useContext middleware???
//  */
// const SFHCalcContext = createContext(null);

// const initialState = {
//   expenses: 0,
//   cashFlow: 0,
//   monthlyPayment: 0,
//   aquisitionCosts: 0,
//   operatingCashFlow: 0,
//   loanBalance: 0,
//   costOfRenno: 0,
//   cashOnCash: 0,
//   capRate: 0,
//   equity: 0,
//   rennoEquity: 0,
//   LTV: 0.8,
//   rennoLTV: 0,
//   totalAquisitionReturn: 0,
//   rennovationReturn: 0,
//   appreciation: 0,
// };

// const SFHCalcReducer = (state, action) => {
//   const { type, payload } = action;
//   switch (type) {
//     case "SET_MONTHLY_PAYMENT": {
//       return { ...state, monthlyPayment: payload };
//     }
//     case "SET_MORTGAGE_PAYMENT": {
//       return { ...state, mortgagePayment: payload };
//     }
//     case "SET_AQUISITION_COSTS": {
//       return { ...state, aquisitionCosts: payload };
//     }
//     case "SET_EXPENSES": {
//       return { ...state, expenses: payload };
//     }
//     case "SET_CASH_FLOW": {
//       return { ...state, cashFlow: payload };
//     }
//     case "SET_CASH_ON_CASH": {
//       return { ...state, cashOnCash: payload };
//     }
//     case "SET_CAP_RATE": {
//       return { ...state, capRate: payload };
//     }
//     case "SET_EQUITY": {
//       return { ...state, equity: payload };
//     }
//     case "SET_RENNO_EQUITY": {
//       return { ...state, rennoEquity: payload };
//     }
//     case "SET_LTV": {
//       return { ...state, LTV: payload };
//     }
//     case "SET_RENNO_LTV": {
//       return { ...state, rennoLTV: payload };
//     }
//     case "SET_TOTAL_AQUISITION_RETURN": {
//       return { ...state, totalAquisitionReturn: payload };
//     }
//     case "SET_RENNOVATION_RETURN": {
//       return { ...state, rennovationReturn: payload };
//     }

//     case "SET_APPRECIATION": {
//       return { ...state, appreciation: payload };
//     }
//     case "SET_OPERATING_CASH_FLOW": {
//       return { ...state, operatingCashFlow: payload };
//     }
//     case "SET_LOAN_BALANCE": {
//       return { ...state, loanBalance: payload };
//     }
//     case "SET_COST_OF_RENNO": {
//       return { ...state, costOfRenno: payload };
//     }
//     case "SET_ROE": {
//       return { ...state, ROE: payload };
//     }
//     case "SET_ROI": {
//       return { ...state, ROI: payload };
//     }
//     case "BATCH_UPDATE": {
//       return { ...state, ...payload };
//     }
//     default: {
//       // This is the default case
//       throw new Error(`Reducer "${type}" not found in SFHCalcReducer`);
//     }
//   }
// };

// const SFHCalcProvider = ({ children }) => {
//   const [calcState, calcDispatch] = useReducer(SFHCalcReducer, initialState);
//   const value = { calcState, calcDispatch };
//   const { loanBalance, costOfRenno, mortgagePayment, equity } = calcState;

//   const { state } = useContext(SFHContext);

//   const convertToNum = (input) => {
//     const output = parseFloat(stripComma(input));
//     return output ? output : 0;
//   };

//   const loanTerm = convertToNum(state.loanTerm);
//   const incOther = convertToNum(state.incOther);
//   const price = convertToNum(state.price);
//   const downPayment = convertToNum(state.downPayment);
//   const closingCosts = convertToNum(state.closingCosts);
//   const repairs = convertToNum(state.repairs);
//   const ARV = convertToNum(state.ARV);
//   const taxes = convertToNum(state.taxes);
//   const insurance = convertToNum(state.insurance);
//   const hoa = convertToNum(state.hoa);
//   const vacancy = convertToNum(state.vacancy);
//   const capEx = convertToNum(state.capEx);
//   const rennovations = convertToNum(state.rennovations);
//   const maintenance = convertToNum(state.maintenance);
//   const management = convertToNum(state.management);
//   const expOther = convertToNum(state.expOther);
//   const rents = convertToNum(state.rents);
//   const appreciation = convertToNum(state.appreciation);
//   const interest = convertToNum(state.interest) / 100;

//   //

//   const calcMonthlyPayment = useMemo(() => {
//     return calcMortgagePayment(loanBalance, interest, loanTerm);
//   }, [loanBalance, interest, loanTerm]);

//   useEffect(() => {
//     calcDispatch({
//       type: "SET_MORTGAGE_PAYMENT",
//       payload: calcMonthlyPayment,
//     });
//   }, [calcMonthlyPayment]);

//   useEffect(() => {
//     debugger;
// const costOfRenno = (repairs + rennovations + closingCosts).toFixed(2);
// const _loanBalance = (price - (downPayment / 100) * price).toFixed(2);
// const rennoEquity = (ARV - costOfRenno - _loanBalance).toFixed(2);
// const rennoLTV = (_loanBalance / ARV).toFixed(3);
// const rennoReturn = (ARV - costOfRenno).toFixed(2);
// const totalAquisitionReturn =
//   ARV === 0
//     ? price - price - repairs - rennovations.toFixed(2)
//     : (ARV - price - repairs - rennovations).toFixed(2);
// const aquisitionCosts = (
//   (downPayment / 100) * price +
//   closingCosts +
//   repairs +
//   rennovations
// ).toFixed(2);
// const expenses = (
//   taxes +
//   insurance +
//   hoa +
//   vacancy +
//   capEx +
//   maintenance +
//   management +
//   expOther +
//   mortgagePayment
// ).toFixed(2);
// const monthlyPayment = (mortgagePayment + taxes + insurance + hoa).toFixed(
//   2
// );
// const cashFlow = (rents + incOther - expenses).toFixed(2);
// const cashOnCash = ((cashFlow / (aquisitionCosts + repairs)) * 100).toFixed(
//   2
// );
// const _equity = price - _loanBalance;
// const ROE = (((cashFlow * 12) / equity) * 100).toFixed(2);
// const ROI = (((cashFlow * 12) / aquisitionCosts) * 100).toFixed(2);
// const operatingCashFlow = cashFlow + mortgagePayment;
// const capRate = (((operatingCashFlow * 12) / price) * 100).toFixed(3);
// const LTV = (_loanBalance / price).toFixed(3);
// const dispatchPayload = {
//   aquisitionCosts: parseFloat(aquisitionCosts),
//   equity: parseFloat(_equity),
//   loanBalance: parseFloat(_loanBalance),
//   rennoLTV: parseFloat(rennoLTV),
//   ARV: parseFloat(ARV),
//   price: parseFloat(price),
//   repairs: parseFloat(repairs),
//   rennovations: parseFloat(rennovations),
//   closingCosts: parseFloat(closingCosts),
//   capRate: parseFloat(capRate),
//   monthlyPayment: parseFloat(monthlyPayment),
//   cashOnCash: parseFloat(cashOnCash),
//   ROE: parseFloat(ROE),
//   ROI: parseFloat(ROI),
//   totalAquisitionReturn: parseFloat(totalAquisitionReturn),
//   rennoEquity: parseFloat(rennoEquity),
//   rennoReturn: parseFloat(rennoReturn),
//   costOfRenno: parseFloat(costOfRenno),
//   expenses: parseFloat(expenses),
//   LTV: parseFloat(LTV),
// };

//   calcDispatch({ type: "BATCH_UPDATE", payload: dispatchPayload });
//   //eslint-disable-next-line
// }, [
//   ARV,
//   costOfRenno,
//   // loanBalance,
//   // mortgagePayment,
//   // price,
//   repairs,
//   rennovations,
//   // downPayment,
//   closingCosts,
//   taxes,
//   insurance,
//   hoa,
//   vacancy,
//   capEx,
//   maintenance,
//   management,
//   expOther,
//   rents,
//   incOther,
//   appreciation,
//   equity,
// ]);

//   console.log("RENDERING SFHCalcContext");

//   return (
//     <SFHCalcContext.Provider value={value}>{children}</SFHCalcContext.Provider>
//   );
// };

// export { SFHCalcProvider };
// export default SFHCalcContext;
