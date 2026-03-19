"use client";

import React, { useEffect, useRef } from 'react';

const CHARS = ['$', '¥', '€', '£', '₿', '→', '↑', '↓', '0', '1', '|', '/', '\\', '_', '=', '+', '~'];

interface Particle {
    x: number;
    y: number;
    char: string;
    speed: number;
    opacity: number;
    fontSize: number;
}

export default function DriftingAscii() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = (isInitial = false): Particle => {
            return {
                x: Math.random() * canvas.width,
                y: isInitial ? Math.random() * canvas.height : canvas.height + 20,
                char: CHARS[Math.floor(Math.random() * CHARS.length)],
                speed: 20 + Math.random() * 20, // 20-40px per second
                opacity: 0.06 + Math.random() * 0.09, // 0.06 to 0.15
                fontSize: 12 + Math.random() * 8,
            };
        };

        // Initial population
        const density = 0.00002; // Sparse density
        const particleCount = Math.floor(window.innerWidth * window.innerHeight * density);
        particles = Array.from({ length: particleCount }, () => createParticle(true));

        let lastTime = performance.now();

        const draw = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px monospace';

            particles.forEach((p, i) => {
                // Move upward
                p.y -= p.speed * dt;

                // Fade out at top
                const fadeZone = canvas.height * 0.2;
                let finalOpacity = p.opacity;
                if (p.y < fadeZone) {
                    finalOpacity = p.opacity * (p.y / fadeZone);
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, finalOpacity)})`;
                ctx.fillText(p.char, p.x, p.y);

                // Recycle particle
                if (p.y < -20) {
                    particles[i] = createParticle();
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
