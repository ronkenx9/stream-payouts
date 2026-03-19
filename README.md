# STREAM 

> **Stripe collects. MPP settles. STREAM distributes.**

STREAM is the missing distribution layer for global payouts. Built for the Tempo x Stripe Hackathon.

## The Pitch
When a business collects a payment via Stripe, STREAM intercepts the settlement event via the new Machine Payments Protocol (MPP), converts it to a TIP-20 stablecoin (USDC) via Tempo, and distributes it instantly to any number of global recipients — settling in under one second.

## Architecture
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom brutalist ASCII animations
- **Payment Collection:** Stripe SDK + PaymentIntents (MPP Crypto)
- **Settlement & Distribution:** Viem + Tempo Testnet RPC

## Getting Started

1. Set up your environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Ensure you provide your Stripe Secret Key, Webhook Secret, Tempo RPC URL, and the Private Key for the STREAM master wallet that acts as the initial fee sponsor.

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## Simulating Payouts
1. Go to the \`/dashboard\`.
2. Add your desired global recipient wallets.
3. Click "TRIGGER MPP PAYOUT". The dashboard will simulate a caught Stripe Webhook and distribute the simulated funds over the Tempo Viem client in under a second.
