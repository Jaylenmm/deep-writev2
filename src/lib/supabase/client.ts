import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { env } from '@/env';

export const createSupabaseBrowserClient = () =>
  createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
