import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe, stripeWebhookSecret } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event: Stripe.Event;
  const buf = await new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
  const sig = req.headers['stripe-signature'] as string;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
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

  res.json({ received: true });
}
