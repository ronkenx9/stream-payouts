import AsciiBackground from '@/components/AsciiBackground';
import AsciiPixelHero from '@/components/AsciiPixelHero';
import { ArrowRight, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <AsciiBackground />

            <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 flex flex-col justify-center">
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
                        <AsciiPixelHero />
                        
                        {/* Overlaying the Network Data on the Hero for a more integrated feel */}
                        <div className="absolute -bottom-4 -left-4 brutalist-border p-6 bg-black/90 backdrop-blur-xl max-w-[280px] z-20 transition-transform group-hover:-translate-y-2">
                             <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-4 h-4 animate-flicker" />
                                <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Network Core</h2>
                            </div>

                            <div className="space-y-3 font-mono text-[10px] opacity-60">
                                <div className="flex justify-between gap-8 border-b border-white/10 pb-1">
                                    <span>[TX_WAITING]</span>
                                    <span className="text-white">STRIPE_HOOK</span>
                                </div>
                                <div className="flex justify-between gap-8 border-b border-white/10 pb-1">
                                    <span>[AWAITING]</span>
                                    <span>MPP_SYNC</span>
                                </div>
                                <div className="flex justify-between gap-8">
                                    <span>[IDLE]</span>
                                    <span>TEMPO_ROUTING</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
