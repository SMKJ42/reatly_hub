import axios, { type AxiosError } from "axios";
import { load } from "cheerio";

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

const getSelectRate = async (req: string) => {
  //regex to parse out unimporant text thats writen in 'node' lingo
  const dayOfUpdate = /\b\d{4}-\d{2}-\d{2}\b/;
  try {
    if (req === "") {
      throw new Error(
        "No request found in loanTypes map src/server/mortgageRates.ts"
      );
    }

    return axios
      .get(`https://fred.stlouisfed.org/series/${req}`)
      .then((res: { data: string }) => {
        const htmlString = res.data;
        const $ = load(htmlString);
        //access the first instance of series-meta-observation-value
        const $rate = $("div.gx-0 > span.series-meta-observation-value");
        const rate = $rate.text();
        const $date = $rate.parent();
        const _date = $date.text().match(dayOfUpdate);
        const date = _date ? _date[0] : "";
        if (rate === "" || rate === undefined || rate === null) {
          throw new Error("No rate found src/server/cron/mortgageRates.ts");
        }
        if (date === "" || date === undefined || date === null) {
          throw new Error("No date found src/server/cron/mortgageRates.ts");
        }
        return { rate, date };
      })
      .catch((error: AxiosError) => {
        return error;
      });
  } catch (error) {
    return error;
  }
};

async function getMortgageRates() {
  const output = Object.keys(loanTypes).map(async (key) => {
    const value = loanTypes[key];
    const mortgage = await getSelectRate(value ?? "");
    return { [key]: mortgage };
  });
  console.log(await Promise.all(output));
  return await Promise.all(output);
}
