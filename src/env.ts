import { z } from 'zod';

/**
 * Runtime environment variables validation.
 *
 * Usage:
 *   import { env } from '@/env';
 *   console.log(env.NEXT_PUBLIC_SUPABASE_URL);
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
