import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import axios, { type AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

interface LoanTypes {
  [key: string]: string;
}

const loanTypes: LoanTypes = {
  thirtyYear: "MORTGAGE30US",
  fifteenYear: "MORTGAGE15US",
  thrityYearFHA: "OBMMIFHA30YF",
  thirtyYearVA: "OBMMIVA30YF",
  thirtyYearUSDA: "OBMMIUSDA30YF",
  thirtyYearConforming: "OBMMIC30YF",
};

export default async function getMortgageRates(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const key = request.query.key as string;
  if (!key) {
    return response
      .status(400)
      .json({ message: "You do not have access to this resource" });
  }

  const ctx = await createTRPCContext({ req: request, res: response });
  const caller = appRouter.createCaller(ctx);

  //create promise array from loan types
  const queryObject = fetchRatePromises(loanTypes);
  const promiseArray = Object.values(queryObject);

  //once all pormises settle, update each rate.
  Promise.allSettled(promiseArray)
    .then((results) => {
      results.forEach((data_response) => {
        if (data_response.status === "fulfilled") {
          createThisRate(data_response.value);
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch mortgage rates",
          });
        }
      });
      return response;
    })
    .catch((cause) => {
      if (cause instanceof TRPCError) {
        const httpCode = getHTTPStatusCodeFromError(cause);
        return response.status(httpCode).json(cause);
      }
      return response;
    });

  function createThisRate(input: AxiosResponse) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const data: { date: string; value: string } = input.data.observations[0];

    let coercedCode = input.config.url ? input.config.url.split("=")[1] : "";
    coercedCode = coercedCode?.split("&")[0]
      ? (coercedCode.split("&")[0] as string)
      : "";

    const name = findName(coercedCode);

    const validReq = {
      key,
      name,
      code: coercedCode,
      rate: parseFloat(data.value),
      updatedAt: new Date(data.date).toISOString(),
    };
    if (validReq) {
      void caller.mortgageRates.create(validReq);
    }
  }
}

export function fetchRatePromises(requestLoanType: { [key: string]: string }): {
  [key: string]: Promise<AxiosResponse>;
} {
  const output: { [key: string]: Promise<AxiosResponse> } = {};
  Object.keys(requestLoanType).map((key) => {
    output[key] = returnPromise(requestLoanType[key] as string);
  });

  function returnPromise(value: string): Promise<AxiosResponse> {
    const FRED = env.FRED_API_KEY;
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${value}&sort_order=desc&limit=1&api_key=${FRED}&file_type=json`;
    return axios.get(url);
  }

  return output;
}

export function findName(code: string) {
  switch (code) {
    case "MORTGAGE30US":
      return "30 Year Fixed";
    case "MORTGAGE15US":
      return "15 Year Fixed";
    case "OBMMIFHA30YF":
      return "30 Year FHA";
    case "OBMMIVA30YF":
      return "30 Year VA";
    case "OBMMIUSDA30YF":
      return "30 Year USDA";
    case "OBMMIC30YF":
      return "30 Year Conforming";
    default:
      return "Unknown";
  }
}
