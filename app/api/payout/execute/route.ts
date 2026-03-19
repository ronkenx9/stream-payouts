export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { distributeBatch } from '@/lib/tempo';
import { getRecipients } from '@/lib/recipients';

export async function POST(req: NextRequest) {
    try {
        const recipients = getRecipients();

        if (recipients.length === 0) {
            return NextResponse.json({ error: 'No recipients configured' }, { status: 400 });
        }

        // Direct manual payout trigger (used for testing without full Stripe Webhook cycle)
        const result = await distributeBatch(recipients);

        if (result.success) {
            return NextResponse.json({ success: true, hash: result.hash, count: recipients.length });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
