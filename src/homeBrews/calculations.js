import { convertToNum, strNumsInput, stripComma } from "./numberDisplay";

export const addArrayFunction = (input) => {
  return input.reduce((a, b) => a + b, 0);
};

export const subtractArrayFunction = (input) => {
  return input.reduce((a, b) => a - b, 0);
};

export const cashOnCash = (cashFlow, aquisitionCost, repairs) => {
  return ((cashFlow / (aquisitionCost + repairs)) * 100).toFixed(2);
};

export const returnOnEquity = (cashFlow, equity) => {
  return ((cashFlow / equity) * 100).toFixed(2);
};

export const capRate = (operatingCashFlow, price) => {
  return ((operatingCashFlow / price) * 100).toFixed(2);
};

export const rennovationReturn = (
  ARV,
  price,
  repairs,
  rennovations,
  closingCosts
) => {
  return ARV - price - repairs - rennovations - closingCosts;
};

export const instantEquity = (price, loanBalance) => {
  return price - loanBalance;
};

export const ARVequity = (ARV, loanBalance) => {
  return ARV - loanBalance;
};

export const LTV = (loanBalance, price) => {
  return (loanBalance / price) * 100;
};

export const rennoEquity = (ARV, loanBalance) => {
  return ARV - loanBalance;
};

export const rennoLTV = (loanBalance, ARV) => {
  return (loanBalance / ARV) * 100;
};

export const Appreciation = (price, appreciation) => {
  return (price * appreciation) / 100;
};

export const calcMortgagePayment = (loanValue, interest, loanTerm) => {
  const output =
    ((interest / 12) * loanValue) /
    (1 - Math.pow(1 + interest / 12, -loanTerm * 12));
  return parseFloat(output.toFixed(2));
};

const pricipalPaydown = (loanValue, interest, loanTerm) => {
  const TMP = calcMortgagePayment(loanValue, interest, loanTerm);
  return TMP - loanValue * (interest / 12);
};

export const amortizationSchedule = (loanValue, interest, loanTerm) => {
  // return subset of arrays that contain the pricipal paydown followed
  // by interest payment
  const output = [];
  let loanPayments = loanTerm * 12;
  let counter = 1;
  while (loanPayments > 0) {
    let set = [];
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

export const convertPercentToDecimal = (percent, ref) => {
  const num1 = convertToNum(percent) / 100;
  const num2 = convertToNum(ref);
  return strNumsInput(num1 * num2, 2);
};

export const convertDecimalToPercent = (float, ref) => {
  const num1 = convertToNum(float);
  const num2 = convertToNum(ref);
  return strNumsInput((num1 / num2) * 100, 3);
};
