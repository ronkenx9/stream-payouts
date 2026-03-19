"use client";

import React, { useEffect, useRef } from 'react';

const CHARS = ['$', '¥', '€', '£', '₿', '→', '↑', '↓', '0', '1', '|', '/', '\\', '_', '=', '+', '~'];

interface Particle {
    x: number;
    y: number;
    char: string;
    speed: number;
    baseOpacity: number;
    fontSize: number;
}

export default function DriftingAscii() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

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
            // Recalculate particles on large resize if needed, but for now just keep moving
        };

        const createParticle = (isInitial = false): Particle => {
            return {
                x: Math.random() * canvas.width,
                y: isInitial ? Math.random() * canvas.height : canvas.height + 20,
                char: CHARS[Math.floor(Math.random() * CHARS.length)],
                speed: 30 + Math.random() * 40, // Increased speed slightly for "max" feel
                baseOpacity: 0.15 + Math.random() * 0.25, // Increased base opacity (0.15 to 0.4)
                fontSize: 14 + Math.random() * 10,
            };
        };

        // High population for "max" volume
        const density = 0.0001; // Increased density by 5x
        const particleCount = Math.floor(window.innerWidth * window.innerHeight * density);
        particles = Array.from({ length: particleCount }, () => createParticle(true));

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        let lastTime = performance.now();

        const draw = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                // Move upward
                p.y -= p.speed * dt;

                // Distance to mouse
                const dx = p.x - mouseRef.current.x;
                const dy = p.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const hoverRadius = 150;

                let opacityBoost = 1;
                let sizeBoost = 1;

                if (dist < hoverRadius) {
                    // Maximum intensity on hover
                    const factor = 1 - dist / hoverRadius;
                    opacityBoost = 1 + factor * 4; // Up to 5x opacity boost
                    sizeBoost = 1 + factor * 0.5; // Up to 1.5x size boost
                }

                // Fade out at top
                const fadeZone = canvas.height * 0.1;
                let finalOpacity = p.baseOpacity * opacityBoost;
                if (p.y < fadeZone) {
                    finalOpacity *= (p.y / fadeZone);
                }

                ctx.font = `${Math.floor(p.fontSize * sizeBoost)}px monospace`;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, finalOpacity)})`;
                ctx.fillText(p.char, p.x, p.y);

                // Recycle particle
                if (p.y < -20) {
                    particles[i] = createParticle();
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();
        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent', mixBlendMode: 'screen' }}
        />
    );
}
