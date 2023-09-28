/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "~/server/db";
import { checkRateLimit } from "./error";
import { editingRateLimit } from "../lib/rateLimits";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

// type CreateContextOptions = Record<string, never>;

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */

// const createInnerTRPCContext = (_opts: CreateContextOptions) => {
//   return {
//     prisma,
//   };
// };

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const { req } = _opts;
  const sesh = getAuth(req);

  const userId = sesh.userId;
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  const role = user?.privateMetadata.role;

  let ip = "";

  if (req.headers["x-real-ip"]) {
    ip = req.headers["x-real-ip"] as string;
  } else if (req.headers["x-forwarded-for"]) {
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

  return {
    prisma,
    userId,
    role,
    ip,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */

export const publicProcedure = t.procedure;

const authorProcedure = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId || ctx.role === "user") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You don't have access to this resource",
    });
  }

  const { success } = await editingRateLimit.limit(ctx.userId);
  checkRateLimit(success);

  return next({
    ctx: {
      userId: ctx.userId,
      role: ctx.role,
    },
  });
});

export const authorRouter = t.procedure.use(authorProcedure);

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do that",
    });
  }
  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

export const privateProcedure = t.procedure.use(enforceUserIsAuthed);
