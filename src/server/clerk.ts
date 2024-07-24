import { createClerkClient, type ClerkClient } from "@clerk/backend";
import { env } from "~/env.mjs";

export const clerkClient: ClerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});
