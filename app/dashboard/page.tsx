"use client";

import { useState, useEffect } from 'react';
import { Play, Plus, Trash2, ArrowLeft, RefreshCw, Activity } from 'lucide-react';
import Link from 'next/link';

interface Recipient {
    id: string;
    label: string;
    address: string;
    amountUSDC: number;
}

export default function Dashboard() {
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [newLabel, setNewLabel] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newAmount, setNewAmount] = useState('5');

    const [isDeploying, setIsDeploying] = useState(false);
    const [logMessages, setLogMessages] = useState<string[]>([
        "[SYS] INITIALIZING STREAM PROTOCOL...",
        "[SYS] STRIPE ENDPOINT LISTENING",
        "[SYS] TEMPO BATCH PRIMITIVE READY"
    ]);

    const fetchRecipients = async () => {
        try {
            const res = await fetch('/api/recipients');
            const data = await res.json();
            setRecipients(data.recipients || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchRecipients();
    }, []);

    const addLog = (msg: string) => {
        setLogMessages(prev => [...prev.slice(-9), msg]); // Keep last 10
    };

    const handleAddRecipient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabel || !newAddress || !newAmount) return;

        try {
            const res = await fetch('/api/recipients', {
                method: 'POST',
                body: JSON.stringify({ label: newLabel, address: newAddress, amountUSDC: Number(newAmount) })
            });
            if (res.ok) {
                addLog(`[ADDED] ${newLabel} -> ${newAddress}`);
                setNewLabel('');
                setNewAddress('');
                fetchRecipients();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const res = await fetch('/api/recipients', {
                method: 'DELETE',
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchRecipients();
        } catch (e) {
            console.error(e);
        }
    };

    const handleTestPayout = async () => {
        setIsDeploying(true);
        addLog("[TRIGGER] MOCK STRIPE PAYMENT INITIATED");

        // Simulate slight delay for Stripe to process
        setTimeout(() => {
            addLog("[WEBHOOK] payment_intent.succeeded CAUGHT");
            addLog(`[TEMPO] COMPILING BATCH INSTRUCTION FOR ${recipients.length} RECIPIENTS`);
        }, 600);

        // Trigger the actual execution endpoint
        setTimeout(async () => {
            try {
                const res = await fetch('/api/payout/execute', { method: 'POST' });
                const data = await res.json();

                if (data.success) {
                    addLog(`[TEMPO] FEES SPONSORED.`);
                    addLog(`[TEMPO] TX SUCCESS: ${data.hash.slice(0, 16)}...`);
                    addLog(`[COMPLETE] ${data.count} PAYOUTS SETTLED IN 800MS.`);
                } else {
                    addLog(`[ERROR] ${data.error}`);
                }
            } catch (err: any) {
                addLog(`[ERROR] ${err.message}`);
            } finally {
                setIsDeploying(false);
            }
        }, 1500);
    };

    return (
        <>
            <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col font-mono text-sm leading-relaxed">

                <header className="flex justify-between items-center mb-8 border-b border-white pb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:opacity-70 transition-opacity">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="text-xl font-bold tracking-widest">[ S T R E A M / D A S H B O A R D ]</div>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/history" className="uppercase opacity-70 hover:opacity-100 hover:underline">
                            History Ledger
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

                    {/* Left panel: Control & Form */}
                    <div className="space-y-8 flex flex-col">
                        <div className="brutalist-border p-6 bg-black">
                            <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-2">
                                <h2 className="uppercase font-bold text-white/70">Sys.Control</h2>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    TEMPO TESTNET
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between">
                                    <span className="opacity-50">API_KEY (STRIPE)</span>
                                    <span>CONNECTED</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-50">FEE_SPONSOR</span>
                                    <span>ACTIVE</span>
                                </div>
                            </div>

                            <button
                                onClick={handleTestPayout}
                                disabled={isDeploying || recipients.length === 0}
                                className="w-full brutalist-button py-6 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                {isDeploying ? (
                                    <>
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                        EXECUTING...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-6 h-6 fill-white" />
                                        TRIGGER MPP PAYOUT
                                    </>
                                )}
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                            </button>
                        </div>

                        {/* Terminal output */}
                        <div className="brutalist-border p-4 bg-black flex-1 flex flex-col min-h-[250px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-30"><Activity className="w-4 h-4" /></div>
                            <h2 className="uppercase font-bold text-white/50 mb-4 border-b border-white/20 pb-2">Terminal</h2>
                            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs opacity-90 break-words flex flex-col justify-end text-green-400">
                                {logMessages.map((msg, i) => (
                                    <div key={i}>{msg}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right panel: Output & Recipient Management */}
                    <div className="lg:col-span-2 brutalist-border p-6 bg-black flex flex-col overflow-hidden relative">
                        <h2 className="uppercase font-bold text-white/70 border-b border-white/20 pb-2 mb-6 flex justify-between">
                            <span>Global Recipient Matrix</span>
                            <span className="opacity-50 text-xs">TARGET_COUNT: {recipients.length}</span>
                        </h2>

                        <form onSubmit={handleAddRecipient} className="grid grid-cols-[1fr_2fr_80px_auto] gap-2 mb-8 items-end">
                            <div>
                                <label className="text-xs opacity-50 block mb-1 uppercase">Label</label>
                                <input
                                    type="text"
                                    value={newLabel}
                                    onChange={e => setNewLabel(e.target.value)}
                                    className="w-full bg-transparent border border-white/30 p-2 focus:outline-none focus:border-white transition-colors uppercase text-sm"
                                    placeholder="e.g. DUBAI"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs opacity-50 block mb-1 uppercase">Wallet Addr</label>
                                <input
                                    type="text"
                                    value={newAddress}
                                    onChange={e => setNewAddress(e.target.value)}
                                    className="w-full bg-transparent border border-white/30 p-2 focus:outline-none focus:border-white transition-colors font-mono text-sm"
                                    placeholder="0x..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs opacity-50 block mb-1 uppercase">USDC</label>
                                <input
                                    type="number"
                                    value={newAmount}
                                    onChange={e => setNewAmount(e.target.value)}
                                    className="w-full bg-transparent border border-white/30 p-2 focus:outline-none focus:border-white transition-colors text-sm"
                                    required
                                />
                            </div>
                            <button type="submit" className="brutalist-button p-2 h-[38px] flex items-center justify-center aspect-square">
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto pr-2 relative">
                            <div className="space-y-2">
                                {recipients.map((r, i) => (
                                    <div key={r.id} className="flex items-center justify-between p-3 border border-white/10 hover:border-white/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <span className="opacity-30 text-xs">{String(i).padStart(2, '0')}</span>
                                            <span className="font-bold uppercase w-24 truncate">{r.label}</span>
                                            <span className="opacity-50 text-xs font-mono">{r.address.slice(0, 12)}...{r.address.slice(-4)}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span>{r.amountUSDC} USDC</span>
                                            <button
                                                onClick={() => handleRemove(r.id)}
                                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {recipients.length === 0 && (
                                    <div className="text-center py-12 opacity-50 border border-dashed border-white/20">
                                        NO TARGETS SPECIFIED.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
