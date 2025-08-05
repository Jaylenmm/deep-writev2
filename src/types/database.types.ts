// Generated Supabase types placeholder
// Replace with `supabase gen types typescript --project-id "..."`.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  // Define your public schema tables here for now; update later.
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          stripe_customer_id: string | null;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          email: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          email?: string;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
