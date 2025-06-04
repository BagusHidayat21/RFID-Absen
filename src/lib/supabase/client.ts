// Initialize and export browser-side Supabase client for Next.js App Router
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'jtag',
      },
    }
  );
};

export const supabase = createClient();
