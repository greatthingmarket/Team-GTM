// src/lib/ratelimit.ts
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialisation du client Redis
const redis = new Redis({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
});

// Création de l'instance Rate Limit
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 requêtes max par fenêtre de 10s
  analytics: true, // Active le dashboard de stats sur Upstash
  prefix: "@upstash/ratelimit",
});