const stripComma = (string) => {
  if (typeof string === "number") {
    string = string.toString();
  }
  const array = string.split("");
  const filter = array.filter((char) => {
    return char !== ",";
  });
  const output = filter.join("");
  return output;
};

//limits the maximum amount of decimal places
const enforceDecimal = (string, max) => {
  if (string) {
    const regExp = new RegExp(`(\\.\\d{${max}})\\d+$`);
    const output = string.replace(regExp, "$1");
    return output;
  } else return "";
};

const addCommas = (string) => {
  let decimalIndex = string.indexOf(".");
  if (decimalIndex === -1) {
    decimalIndex = string.length - 1;
  } else {
    decimalIndex--;
  }
  const array = string.split("");
  let j = 0;
  for (let i = decimalIndex; i >= 0; i--) {
    if (j % 3 === 0 && j !== 0) {
      array.splice(i + 1, 0, ",");
    }
    j++;
  }
  const output = array.join("");
  return output;
};

//ensures only numbers and decimals are entered
const enforceStrNums = (string) => {
  const output = string.replace(/[^\d.]/g, "");
  return output;
};

const strNumsInput = (string, max) => {
  if (typeof string === "number") {
    string = string.toString();
  }
  const stripped = enforceStrNums(string);
  const commas = addCommas(stripped);
  if (!max) {
    return commas;
  }
  return enforceDecimal(commas, max);
};

const convertToNum = (input) => {
  if (typeof input === "number" && isNaN(input))
    throw new Error(`THROWING NaN to find bug in ${input}`);
  console.log("convertToNum input", input);
  const output = parseFloat(stripComma(input));
  return output ? output : 0;
};

export { stripComma, strNumsInput, convertToNum };
