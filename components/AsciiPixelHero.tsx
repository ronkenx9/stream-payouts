"use client";

import React, { useEffect, useRef } from 'react';

const ASCII_RAMP = "@#S08Xox+=;:-,. ";
const CELL_W = 11;
const CELL_H = 14;
const GRID_STEP = 24;

export default function AsciiPixelHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const asciiCanvasRef = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);
    const sourceImageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = '/hero-source.png';
        img.onload = () => {
            sourceImageRef.current = img;
            init();
        };

        let animationFrameId: number;
        let startTime = Date.now();

        const init = () => {
            const asciiCanvas = asciiCanvasRef.current;
            const gridCanvas = gridCanvasRef.current;
            if (!asciiCanvas || !gridCanvas || !sourceImageRef.current) return;

            const img = sourceImageRef.current;
            const aspect = img.height / img.width;
            const targetWidth = 600; // Scaled down for hero area
            const targetHeight = targetWidth * aspect;

            asciiCanvas.width = targetWidth;
            asciiCanvas.height = targetHeight;
            gridCanvas.width = targetWidth;
            gridCanvas.height = targetHeight;

            const ctxAscii = asciiCanvas.getContext('2d', { willReadFrequently: true });
            const ctxGrid = gridCanvas.getContext('2d');
            if (!ctxAscii || !ctxGrid) return;

            // Pre-draw grid once (Step 4)
            ctxGrid.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctxGrid.lineWidth = 1;
            for (let x = 0; x < targetWidth; x += GRID_STEP) {
                for (let y = 0; y < targetHeight; y += GRID_STEP) {
                    ctxGrid.strokeRect(x, y, GRID_STEP, GRID_STEP);
                }
            }

            // Create offscreen buffer for sampling
            const buffer = document.createElement('canvas');
            buffer.width = targetWidth;
            buffer.height = targetHeight;
            const bctx = buffer.getContext('2d');
            if (!bctx) return;
            bctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            const imageData = bctx.getImageData(0, 0, targetWidth, targetHeight);

            const render = () => {
                const elapsed = (Date.now() - startTime) / 1000;
                ctxAscii.clearRect(0, 0, targetWidth, targetHeight);
                ctxAscii.font = `${CELL_H}px monospace`;
                ctxAscii.textAlign = 'center';
                ctxAscii.textBaseline = 'middle';

                for (let y = 0; y < targetHeight; y += CELL_H) {
                    for (let x = 0; x < targetWidth; x += CELL_W) {
                        const idx = (Math.floor(y) * targetWidth + Math.floor(x)) * 4;
                        const r = imageData.data[idx];
                        const g = imageData.data[idx + 1];
                        const b = imageData.data[idx + 2];
                        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

                        if (lum > 0.25) { // Subject threshold (Step 3)
                            // Normalized Color (Color Formula)
                            const mx = Math.max(r, g, b, 1);
                            const nr = (r / mx) * 255;
                            const ng = (g / mx) * 255;
                            const nb = (b / mx) * 255;

                            // Sine wave pulse (Step 7)
                            const pulse = 0.8 + Math.sin(elapsed * 2 + (x + y) * 0.01) * 0.2;
                            
                            // Horizontal shine sweep (Step 7)
                            const sweepPos = (elapsed * 300) % (targetWidth * 2);
                            const distToSweep = Math.abs(x - (sweepPos - targetWidth/2));
                            const sweepEffect = Math.max(1, 2 - distToSweep / 100);

                            // ASCII Ramp mapping (Step 5)
                            const charIdx = Math.floor((1 - lum) * (ASCII_RAMP.length - 1));
                            const char = ASCII_RAMP[charIdx];

                            ctxAscii.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${pulse * 0.8})`;
                            if (sweepEffect > 1) {
                                ctxAscii.fillStyle = `rgba(255, 255, 255, ${pulse})`;
                                ctxAscii.shadowBlur = 15;
                                ctxAscii.shadowColor = "white";
                            } else {
                                ctxAscii.shadowBlur = 0;
                            }

                            ctxAscii.fillText(char, x + CELL_W / 2, y + CELL_H / 2);
                        } else {
                            // Background dots (Step 5/7)
                            ctxAscii.fillStyle = 'rgba(40, 65, 100, 0.2)';
                            ctxAscii.fillText('.', x + CELL_W / 2, y + CELL_H / 2);
                        }
                    }
                }
                animationFrameId = requestAnimationFrame(render);
            };
            render();
        };

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-[600px] aspect-square mx-auto my-12 group">
            {/* Layer 1: Blurred BG (Simulated with CSS filter on a hidden copy or simplified) */}
            <div 
                className="absolute inset-0 opacity-20 blur-2xl saturate-50 brightness-50 pointer-events-none transition-all duration-700 group-hover:opacity-40"
                style={{
                    backgroundImage: 'url(/hero-source.png)',
                    backgroundSize: 'cover',
                    filter: 'blur(40px) brightness(0.4) saturate(0.5)'
                }}
            />
            
            {/* Layer 2: Pixel Grid */}
            <canvas 
                ref={gridCanvasRef} 
                className="absolute inset-0 pointer-events-none"
            />

            {/* Layer 3: ASCII Core */}
            <canvas 
                ref={asciiCanvasRef} 
                className="absolute inset-0 z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />

            {/* Scanline Overlay local to hero */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-5">
                <div className="w-full h-full animate-scanline bg-gradient-to-b from-transparent via-white to-transparent" />
            </div>
        </div>
    );
}
