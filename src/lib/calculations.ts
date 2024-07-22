export const convertPercentToDecimal = (percent: number, ref: number) => {
  return (percent * ref) / 100;
};

export const convertDecimalToPercent = (percent: number, ref: number) => {
  return (percent / ref) * 100;
};

/*
 * This function takes a number and a decimal place
 * 0.01 rounds to the nearest hundredth
 * 1 rounds to the nearest whole number
 */

export const dynamicRound = (number: number, roundAt: number) => {
  return Math.round(number * (1 / roundAt)) / (1 / roundAt);
};
