const stripComma = (input: number | string) => {
  if (typeof input === "number") {
    input = input.toString();
  }
  const array = input.split("");
  const filter = array.filter((char) => {
    return char !== ",";
  });
  const output = filter.join("");
  return output;
};

//limits the maximum amount of decimal places
const enforceDecimal = (string: string, max: number) => {
  const regExp = new RegExp(`(\\.\\d{${max}})\\d+$`);
  const output = string.replace(regExp, "$1");
  return output;
};

const addCommas = (string: string) => {
  let negative = false;
  let decimalIndex = string.indexOf(".");

  if (string[0] === "-") {
    negative = true;
  }

  if (decimalIndex === -1) {
    decimalIndex = string.length - 1;
  } else {
    decimalIndex--;
  }

  const array = string.split("");
  if (negative) array.shift();

  let j = 0;
  for (let i = decimalIndex; i >= 0; i--) {
    if (j % 3 === 0 && j !== 0) {
      array.splice(i + 1, 0, ",");
    }
    j++;
  }

  if (negative) array.unshift("-");
  const output = array.join("");
  return output;
};

//ensures only numbers and decimals are entered
const enforceStrNums = (string: string) => {
  const output = string.replace(/[^\d.-]/g, "");
  return output;
};

const strNumsInput = (input: number | string, max?: number) => {
  if (typeof input === "number") {
    input = input.toString();
  }
  const stripped = enforceStrNums(input);
  const commas = addCommas(stripped);
  if (!max) {
    return commas;
  }
  return enforceDecimal(commas, max);
};

const convertToNum = (input: string) => {
  const output = parseFloat(stripComma(input));
  return output ? output : (0 as number);
};

export { stripComma, strNumsInput, convertToNum };
