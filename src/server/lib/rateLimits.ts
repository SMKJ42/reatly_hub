import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";

export const serverRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 s"),
  analytics: true,
});
