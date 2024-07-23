import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";

const redis = Redis.fromEnv() || new Redis({ url: "", token: "" });

export const serverRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "10 s"),
  analytics: true,
});
