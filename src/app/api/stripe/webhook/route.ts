/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { stripe, stripeWebhookSecret } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export const runtime = 'edge';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.customer as string;
    const userId = session.metadata?.userId as string;
    const supabase = createSupabaseServerClient();
    await (supabase as any)
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId);
  }

  return NextResponse.json({ received: true });
}
