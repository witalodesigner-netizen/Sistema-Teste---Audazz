import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Módulo de Rate Limiting - Audazz Nexus OS
 * Proteção contra ataques de força bruta e DDoS usando Upstash Redis.
 */

// Inicializa o Redis da Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Cria um rate limiter configurável
 */
const createLimiter = (tokens: number, window: string) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window as any),
    analytics: true,
    prefix: "@audazz/ratelimit",
  });
};

// Definição dos limitadores por tipo de recurso
export const limiters = {
  // Autenticação (Clerk/Portal): 10 tentativas por minuto
  auth: createLimiter(10, "1 m"),
  
  // Webhooks (Asaas/RD Station): 100 requisições por minuto
  webhooks: createLimiter(100, "1 m"),
  
  // API Pública/GET: 300 requisições por minuto
  apiGet: createLimiter(300, "1 m"),
  
  // API Pública/POST-PUT: 100 requisições por minuto
  apiPost: createLimiter(100, "1 m"),
  
  // Login do Portal (Client): 5 tentativas por 15 minutos
  portalLogin: createLimiter(5, "15 m"),
  
  // Tokens de Aprovação: 30 requisições por hora
  approval: createLimiter(30, "1 h"),
};

/**
 * Função utilitária para verificar rate limit em Server Actions ou Route Handlers
 */
export async function checkRateLimit(
  type: keyof typeof limiters,
  identifier: string
) {
  const { success, limit, remaining, reset } = await limiters[type].limit(
    `${type}:${identifier}`
  );

  return {
    success,
    limit,
    remaining,
    reset,
  };
}
