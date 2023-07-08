import { TRPCError } from "@trpc/server";

export function checkRateLimit(success: boolean) {
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "You have exceeded your rate limit",
    });
  }
}
