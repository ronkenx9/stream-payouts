export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { distributeBatch } from '@/lib/tempo';
import { getRecipients } from '@/lib/recipients';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    let event;

    try {
        // We try to verify if STRIPE_WEBHOOK_SECRET is set
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            // For local hackathon dev without webhook secret set, just parse it
            event = JSON.parse(body);
        }
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the MPP / PaymentIntent success event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        // Check if this was an MPP crypto payment (Tempo logic placeholder)
        console.log(`[STRIPE WEBHOOK] Received successful payment intent: ${paymentIntent.id}`);

        // Trigger global distribution
        const recipients = getRecipients();
        console.log(`[STREAM] Payout collected. Distributing to ${recipients.length} global wallets instantly via Tempo...`);

        const result = await distributeBatch(recipients);

        if (result.success) {
            console.log(`[STREAM] Distribution complete. TxHash: ${result.hash}`);
            return NextResponse.json({ received: true, distributed: true, hash: result.hash });
        } else {
            console.error(`[STREAM] Distribution failed: ${result.error}`);
            return new NextResponse('Tempo Distribution Failed', { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
