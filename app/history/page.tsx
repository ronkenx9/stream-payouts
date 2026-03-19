"use client";

import AsciiBackground from '@/components/AsciiBackground';
import { ArrowLeft, Box } from 'lucide-react';
import Link from 'next/link';

// Mock history since we don't store it persistently for the MVP
const MOCK_HISTORY = [
    { id: '1', date: '2026-03-19T10:14:02Z', amount: 50, count: 10, hash: '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc' },
    { id: '2', date: '2026-03-19T09:42:12Z', amount: 35, count: 7, hash: '0xdef4567890abcdef1234567890abcdef1234567890abcdef1234567890abcf0' },
    { id: '3', date: '2026-03-18T15:22:11Z', amount: 120, count: 24, hash: '0x0123abcdef4567890abcdef1234567890abcdef1234567890abcdef1234567' },
];

export default function History() {
    return (
        <>
            <AsciiBackground />
            <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col font-mono text-sm leading-relaxed">

                <header className="flex justify-between items-center mb-12 border-b border-white pb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="hover:opacity-70 transition-opacity">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="text-xl font-bold tracking-widest">[ I M M U T A B L E / L E D G E R ]</div>
                    </div>
                </header>

                <div className="brutalist-border p-6 bg-black relative">
                    <div className="grid grid-cols-[1fr_1fr_1fr_2fr] gap-4 mb-4 border-b border-white pb-2 font-bold uppercase opacity-70">
                        <div>Timestamp</div>
                        <div>Total Volume</div>
                        <div>Recipients</div>
                        <div className="text-right">Tempo Tx Hash</div>
                    </div>

                    <div className="space-y-4">
                        {MOCK_HISTORY.map(tx => (
                            <div key={tx.id} className="grid grid-cols-[1fr_1fr_1fr_2fr] gap-4 items-center p-4 border border-white/20 hover:border-white/80 transition-colors group">
                                <div className="opacity-80">
                                    {new Date(tx.date).toLocaleTimeString()}
                                </div>
                                <div>
                                    {tx.amount} USDC
                                </div>
                                <div>
                                    [{tx.count}] Targets
                                </div>
                                <div className="text-right flex items-center justify-end gap-2">
                                    <a href={`https://explorer.tempo.xyz/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="opacity-50 group-hover:opacity-100 hover:underline flex items-center gap-2">
                                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                                        <Box className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/20 text-center opacity-40 text-xs uppercase tracking-widest">
                        END OF LEDGER
                    </div>
                </div>

            </div>
        </>
    );
}
