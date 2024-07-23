import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import {
  fetchRatePromises,
  findName,
} from "../maintenance/createMortgageRates";

const loanTypes = {
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
  if (!key || key !== env.CRON_KEY) {
    return response
      .status(400)
      .json({ message: "You do not have access to this resource" });
  }

  const ctx = await createTRPCContext({ req: request, res: response });

  const caller = appRouter.createCaller(ctx);

  //create promise array from loan types
  const queryObject = fetchRatePromises(loanTypes);
  const fetch_promise_array = Object.values(queryObject);
  const update_promise_array = [];

  //once all promises settle, update each rate.
  Promise.allSettled(fetch_promise_array)
    .then((results) => {
      results.forEach((resolvedPromise) => {
        if (resolvedPromise.status === "fulfilled") {
          update_promise_array.push(updataThisRate(resolvedPromise.value));
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

  function updataThisRate(input: AxiosResponse) {
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
      void caller.mortgageRates.update(validReq);
    }
  }
}
