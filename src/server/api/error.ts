import { TRPCError } from "@trpc/server";

export function checkRateLimit(success: boolean) {
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "You have exceeded your rate limit",
    });
  }
}

export const AuthenticationError = new TRPCError({
  code: "UNAUTHORIZED",
  message: "You must be logged in to do that",
});

export const PrivilegeError = new TRPCError({
  code: "UNAUTHORIZED",
  message: "You don't have access to this resource",
});
