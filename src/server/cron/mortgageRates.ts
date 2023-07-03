import axios, { type AxiosError } from "axios";
import { api } from "~/utils/api";

const loanTypes: { [key: string]: string } = {
  thirtyYear: "MORTGAGE30US",
  fifteenYear: "MORTGAGE15US",
  // "5/1 ARM": "MORTGAGE5US",
  // "1-year ARM": "MORTGAGE1US",
  // "30-year jumbo": "MORTGAGE30US",
  // "15-year jumbo": "MORTGAGE15US",
  // "5/1 ARM jumbo": "MORTGAGE5US",
  // "1-year ARM jumbo": "MORTGAGE1US",

  thrityYearFHA: "OBMMIFHA30YF",
  // "15-year FHA": "MORTGAGE15US",
  // "5/1 ARM FHA": "MORTGAGE5US",
  // "1-year ARM FHA": "MORTGAGE1US",

  thirtyYearVA: "OBMMIVA30YF",
  // "15-year VA": "MORTGAGE15US",
  // "5/1 ARM VA": "MORTGAGE5US",
  // "1-year ARM VA": "MORTGAGE1US",

  // "30-year USDA": "MORTGAGE30US",
  // "15-year USDA": "MORTGAGE15US",
  // "5/1 ARM USDA": "MORTGAGE5US",
  // "1-year ARM USDA": "MORTGAGE1US",
};

// const getSelectRate = async (req: string) => {};

// async function getMortgageRates() {
//   const output = Object.keys(loanTypes).map(async (key) => {
//     const value = loanTypes[key];
//     const mortgage = await getSelectRate(value ?? "");
//     return [key, mortgage];
//   });
//   await Promise.all(output);
//   api.singleFamily.create.useMutation({});
// }
