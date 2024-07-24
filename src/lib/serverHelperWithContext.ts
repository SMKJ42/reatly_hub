import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import { type GetServerSidePropsContext } from "next";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { type RealtyHubRole } from "./priviledges";

export async function serverHelperWithContext(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const { req } = context;
  const sesh = getAuth(req);

  const userId = sesh.userId;
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  const role = user?.publicMetadata.role as RealtyHubRole;

  let ip = "";

  if (req.headers?.["x-real-ip"]) {
    ip = req.headers["x-real-ip"] as string;
  } else if (req.headers?.["x-forwarded-for"]) {
    const forwarded = req.headers["x-forwarded-for"] as string;
    ip = forwarded.split(/\s*,\s*/)[0] as string;
  } else {
    ip = req.connection.remoteAddress as string;
  }

  if (!ip) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "",
    });
  }

  return createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId, role: role, ip },
    transformer: SuperJSON,
  });
}
