import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const ctx = createTRPCContext({ req: request, res: response });
  const caller = appRouter.createCaller(ctx);

  try {
    const key = request.query.key as string;
    await caller.mortgageRates.create({
      key: key,
      name: "test",
      rate: 2.75,
    });
    response.status(200).json({ success: true });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      console.log(cause);
      return response.status(httpCode).json(cause);
    }
    console.log(cause);
    response.status(500).json({ message: "internal server error" });
  }

  // return response;
}
