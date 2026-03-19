import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Missing STRIPE_SECRET_KEY, using dummy key for build');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
    apiVersion: '2024-12-18.acacia' as any, // Using latest or any valid for the TS compiler
});

/**
 * Creates a Stripe Payment Intent using the Machine Payments Protocol (MPP) primitive.
 * This explicitly routes the settlement to the Tempo network via crypto payment methods.
 */
export async function createMppPaymentIntent(amountUnit: number, currency: string = 'usd') {
    return await stripe.paymentIntents.create({
        amount: amountUnit,
        currency,
        payment_method_types: ['crypto'],
        payment_method_data: { type: 'crypto' } as any,
        payment_method_options: {
            crypto: {
                mode: 'deposit',
                // Example syntax per hackathon specs
                deposit_options: { networks: ['tempo'] }
            }
        } as any,
        confirm: true,
    });
}
