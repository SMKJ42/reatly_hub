import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import axios, { type AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

interface LoanTypes {
  [key: string]: string | Promise<AxiosResponse>;
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
      results.forEach((resolvedPromise) => {
        console.log(resolvedPromise);
        if (resolvedPromise.status === "fulfilled") {
          createThisRate(resolvedPromise.value as AxiosResponse);
        }
      });
      return response.status(200).json({ message: "success" });
    })
    .catch((cause) => {
      console.log(cause);
      if (cause instanceof TRPCError) {
        const httpCode = getHTTPStatusCodeFromError(cause);
        return response.status(httpCode).json(cause);
      }
      return response.status(500).json({ message: "internal server error" });
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

function fetchRatePromises(requestLoanType: {
  [key: string]: string | Promise<AxiosResponse>;
}) {
  Object.keys(requestLoanType).forEach((key) => {
    requestLoanType[key] = returnPromise(requestLoanType[key] as string);
  });

  function returnPromise(value: string) {
    const FRED = env.FRED_API_KEY;
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${value}&sort_order=desc&limit=1&api_key=${FRED}&file_type=json`;
    return axios.get(url);
  }

  return requestLoanType;
}

function findName(code: string) {
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
