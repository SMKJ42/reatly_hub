import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import axios, { type AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const loanTypes = {
  thirtyYear: "MORTGAGE30US",
  fifteenYear: "MORTGAGE15US",
  thrityYearFHA: "OBMMIFHA30YF",
  thirtyYearVA: "OBMMIVA30YF",
  thirtyYearUSDA: "OBMMIUSDA30YF",
  thirtyYearConforming: "OBMMIC30YF",
};

export default function getMortgageRates(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const ctx = createTRPCContext({ req: request, res: response });
  const caller = appRouter.createCaller(ctx);

  const key = request.query.key as string;

  if (!key) {
    return response
      .status(400)
      .json({ message: "You do not have access to this resource" });
  }

  const queryObject = fetchRatePromises(loanTypes);
  const promiseArray = Object.values(queryObject);
  Promise.allSettled(promiseArray)
    .then((results) => {
      results.forEach((resolvedPromise) => {
        if (resolvedPromise.status === "fulfilled") {
          updataRates(resolvedPromise.value as AxiosResponse<any, any>);
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

  function updataRates(input: AxiosResponse<any, any>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const data: { date: string; value: string } = input.data.observations[0];

    let code = input.config.url ? input.config.url.split("=")[1] : "";
    code = code?.split("&")[0] ? (code.split("&")[0] as string) : "";

    const output = {
      key,
      code,
      rate: parseFloat(data.value),
      updatedAt: new Date(data.date).toISOString(),
    };
    if (output) {
      void caller.mortgageRates.update(output);
    }
  }
}

function fetchRatePromises(objectInput: {
  [key: string]: string | Promise<AxiosResponse<any, any>>;
}) {
  Object.keys(objectInput).forEach((key) => {
    objectInput[key] = returnPromise(objectInput[key] as string);
  });

  function returnPromise(value: string) {
    const FRED = env.FRED_API_KEY;
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${value}&sort_order=desc&limit=1&api_key=${FRED}&file_type=json`;
    return axios.get(url);
  }

  return objectInput;
}
