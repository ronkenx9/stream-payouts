import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import './globals.css';
import DriftingAscii from '@/components/DriftingAscii';

const spaceMono = Space_Mono({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-jetbrains-mono' // repurposing the variable name for simplicity
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={spaceMono.variable}>
            <body className="bg-black text-white min-h-screen crt">
                <DriftingAscii />
                {/* Subtle scanline overlay */}
                <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-overlay opacity-10">
                    <div className="h-full w-full animate-scanline bg-gradient-to-b from-transparent via-white to-transparent" />
                </div>
                <main className="relative z-10 min-h-screen flex flex-col">
                    {children}
                </main>
            </body>
        </html>
    );
}
