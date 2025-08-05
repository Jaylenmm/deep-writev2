import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  try {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

    const supa: any = supabase as any;
  const { data: profile } = await supa
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  const customerId = (profile as any)?.stripe_customer_id as string | null;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId!,
    return_url: process.env.NEXT_PUBLIC_APP_URL + '/account',
  });

  redirect(portalSession.url);
  } catch (err: any) {
    return <main className="p-8 text-center text-red-600">Billing page failed to load: {(err && err.message) || String(err)}</main>;
  }
}
