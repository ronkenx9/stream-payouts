import AsciiBackground from '@/components/AsciiBackground';
import { ArrowRight, Wallet, Globe, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <AsciiBackground />

            <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12 flex flex-col">
                <header className="flex justify-between items-center mb-24 border-b border-white pb-6">
                    <div className="text-2xl font-bold tracking-tighter">
                        [ S T R E A M ]
                    </div>
                    <div className="text-sm font-mono opacity-80 animate-pulse">
                        SYS.STATUS = ONLINE
                    </div>
                </header>

                <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 leading-none">
                            Instant<br />
                            Global<br />
                            Payouts
                        </h1>
                        <p className="text-lg md:text-xl opacity-80 mb-10 max-w-md">
                            Stripe collects the money. MPP settles on Tempo. STREAM distributes it globally in under one second.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/dashboard" className="brutalist-button px-8 py-4 inline-flex items-center justify-center gap-2 group">
                                ENTER SYSTEM
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="https://stripe.com/blog/machine-payments-protocol" target="_blank" rel="noreferrer" className="px-8 py-4 border border-white/30 hover:border-white transition-colors inline-flex justify-center flex-col uppercase text-sm">
                                READ MPP DOCS
                            </a>
                        </div>
                    </div>

                    <div className="brutalist-border p-8 bg-black/80 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-white" />

                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="w-6 h-6 animate-flicker" />
                            <h2 className="text-xl uppercase tracking-widest">Live Network</h2>
                        </div>

                        <div className="space-y-4 font-mono text-sm opacity-80">
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <span>[TX_WAITING]</span>
                                <span>STRIPE_HOOK</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-2 text-white/40">
                                <span>[AWAITING]</span>
                                <span>MPP_CONFIRMATION</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-2 text-white/40">
                                <span>[IDLE]</span>
                                <span>TEMPO_ROUTING</span>
                            </div>
                            <div className="pt-4 mt-6">
                                <span className="bg-white text-black px-2 py-1 text-xs font-bold uppercase">
                                    Connected: Testnet
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
