import { strNumsInput } from "./numberDisplay";

export const addArrayFunction = (input: number[]) => {
  return input.reduce((a, b) => a + b, 0);
};

export const subtractArrayFunction = (input: number[]) => {
  return input.reduce((a, b) => a - b, 0);
};

export const cashOnCash = (
  cashFlow: number,
  aquisitionCost: number,
  repairs: number
) => {
  return ((cashFlow / (aquisitionCost + repairs)) * 100).toFixed(2);
};

export const returnOnEquity = (cashFlow: number, equity: number) => {
  return ((cashFlow / equity) * 100).toFixed(2);
};

export const capRate = (operatingCashFlow: number, price: number) => {
  return ((operatingCashFlow / price) * 100).toFixed(2);
};

export const rennovationReturn = (
  ARV: number,
  price: number,
  repairs: number,
  rennovations: number,
  closingCosts: number
) => {
  return ARV - price - repairs - rennovations - closingCosts;
};

export const instantEquity = (price: number, loanBalance: number) => {
  return price - loanBalance;
};

export const ARVequity = (ARV: number, loanBalance: number) => {
  return ARV - loanBalance;
};

export const LTV = (loanBalance: number, price: number) => {
  return (loanBalance / price) * 100;
};

export const rennoEquity = (ARV: number, loanBalance: number) => {
  return ARV - loanBalance;
};

export const rennoLTV = (loanBalance: number, ARV: number) => {
  return (loanBalance / ARV) * 100;
};

export const Appreciation = (price: number, appreciation: number) => {
  return (price * appreciation) / 100;
};

export const calcMortgagePayment = (
  loanValue: number,
  interest: number,
  loanTerm: number
) => {
  const output =
    ((interest / 12) * loanValue) /
    (1 - Math.pow(1 + interest / 12, -loanTerm * 12));
  return parseFloat(output.toFixed(2));
};

const pricipalPaydown = (
  loanValue: number,
  interest: number,
  loanTerm: number
) => {
  const TMP = calcMortgagePayment(loanValue, interest, loanTerm);
  return TMP - loanValue * (interest / 12);
};

export const amortizationSchedule = (
  loanValue: number,
  interest: number,
  loanTerm: number
) => {
  // return subset of arrays that contain the pricipal paydown followed
  // by interest payment
  const output = [];
  let loanPayments = loanTerm * 12;
  let counter = 1;
  while (loanPayments > 0) {
    const set: number[] = [];
    const TMP = calcMortgagePayment(loanValue, interest, loanTerm);
    const PPD = pricipalPaydown(loanValue, interest, loanTerm);
    set.push(PPD);
    set.push(TMP - PPD);
    set.push(counter);
    output.push(set);
    loanValue -= PPD;
    loanPayments--;
    counter++;
  }
  return output;
};

export const convertPercentToDecimal = (percent: number, ref: number) => {
  // const num1 = convertToNum(percent) / 100;
  // const num2 = convertToNum(ref);
  return (percent * ref) / 100;
};

export const convertDecimalToPercent = (percent: number, ref: number) => {
  return (percent / ref) * 100;
};
