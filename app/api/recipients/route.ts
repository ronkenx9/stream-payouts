export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getRecipients, addRecipient, removeRecipient } from '@/lib/recipients';

export async function GET() {
    const recipients = getRecipients();
    return NextResponse.json({ recipients });
}

export async function POST(req: NextRequest) {
    try {
        const { label, address, amountUSDC } = await req.json();
        if (!label || !address || !amountUSDC) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        const newRecipient = addRecipient(label, address as `0x${string}`, amountUSDC);
        return NextResponse.json({ recipient: newRecipient });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        removeRecipient(id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
