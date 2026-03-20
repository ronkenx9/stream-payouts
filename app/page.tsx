import { ArrowRight, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 flex flex-col justify-center relative">
            <header className="flex justify-between items-center mb-16 border-b border-white pb-6 relative z-10">
                <div className="text-2xl font-bold tracking-tighter">
                    [ S T R E A M ]
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    SYS.STATUS = ONLINE
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4">
                            Instant<br />
                            Global<br />
                            Payouts
                        </h1>
                        <div className="h-1 w-24 bg-white" />
                    </div>
                    
                    <p className="text-xl opacity-60 max-w-md leading-relaxed">
                        Stripe collects the money. MPP settles on Tempo. STREAM distributes it globally in under one second.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                        <Link href="/dashboard" className="brutalist-button px-10 py-5 inline-flex items-center justify-center gap-3 group text-lg font-bold">
                            ENTER SYSTEM
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <a href="https://stripe.com/blog/machine-payments-protocol" target="_blank" rel="noreferrer" className="px-10 py-5 border border-white/20 hover:bg-white/5 transition-all inline-flex justify-center items-center uppercase text-xs tracking-widest font-bold">
                            READ MPP DOCS
                        </a>
                    </div>
                </div>

                <div className="relative group">
                    {/* The 3D globe is now the background, this section holds the live network data */}
                    <div className="brutalist-border p-10 bg-black/60 backdrop-blur-3xl border-white/20 relative overflow-hidden group">
                         <div className="flex items-center gap-4 mb-8">
                            <Activity className="w-5 h-5 animate-pulse text-white" />
                            <h2 className="text-sm uppercase tracking-[0.3em] font-bold">Real-time Node</h2>
                        </div>

                        <div className="space-y-6 font-mono text-xs opacity-70">
                            <div className="flex justify-between gap-12 border-b border-white/10 pb-2">
                                <span className="text-white/40">[TX_LATENCY]</span>
                                <span className="text-white">0.42s</span>
                            </div>
                            <div className="flex justify-between gap-12 border-b border-white/10 pb-2">
                                <span className="text-white/40">[SETTLEMENT]</span>
                                <span className="text-white">USDC-T</span>
                            </div>
                            <div className="flex justify-between gap-12">
                                <span className="text-white/40">[PROTOCOL]</span>
                                <span className="text-white">STRIPE-MPP</span>
                            </div>
                            <div className="pt-8 flex items-center gap-2">
                                <Zap size={14} className="text-white fill-white" />
                                <span className="bg-white text-black px-2 py-0.5 text-[10px] font-bold uppercase">
                                    Network: Tempo Mainnet
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
