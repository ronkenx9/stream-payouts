"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ASCII_RAMP = "@#S08Xox+=;:-,. ";
const CELL_W = 10;
const CELL_H = 12;
const GRID_STEP = 32;

const COLORS = {
    ocean: '#000814',
    na: '#3a86ff',
    sa: '#ff006e',
    eu: '#38b000',
    af: '#ffbe0b',
    as: '#e01e37',
    oc: '#fb5607',
    an: '#ffffff'
};

export default function GlobalAsciiBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const asciiCanvasRef = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!asciiCanvasRef.current || !gridCanvasRef.current) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // 1. Setup Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);

        // 2. Procedural World Map
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = 2048;
        mapCanvas.height = 1024;
        const mctx = mapCanvas.getContext('2d');
        if (mctx) {
            mctx.fillStyle = COLORS.ocean;
            mctx.fillRect(0, 0, 2048, 1024);
            const drawContinent = (x: number, y: number, w: number, h: number, color: string) => {
                mctx.fillStyle = color;
                mctx.beginPath();
                mctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
                mctx.fill();
            };
            drawContinent(500, 300, 250, 150, COLORS.na);
            drawContinent(650, 650, 150, 220, COLORS.sa);
            drawContinent(1050, 250, 180, 120, COLORS.eu);
            drawContinent(1100, 500, 160, 200, COLORS.af);
            drawContinent(1500, 300, 300, 200, COLORS.as);
            drawContinent(1700, 700, 120, 100, COLORS.oc);
            drawContinent(1024, 1000, 1000, 40, COLORS.an);
        }

        const texture = new THREE.CanvasTexture(mapCanvas);
        const geometry = new THREE.SphereGeometry(2.5, 64, 64);
        const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 0 });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1.5);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // 3. ASCII Processing
        const asciiCanvas = asciiCanvasRef.current;
        const gridCanvas = gridCanvasRef.current;
        
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            asciiCanvas.width = width;
            asciiCanvas.height = height;
            gridCanvas.width = width;
            gridCanvas.height = height;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // Redraw grid
            const ctxGrid = gridCanvas.getContext('2d');
            if (ctxGrid) {
                ctxGrid.clearRect(0, 0, width, height);
                ctxGrid.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                for (let x = 0; x < width; x += GRID_STEP) {
                    for (let y = 0; y < height; y += GRID_STEP) {
                        ctxGrid.strokeRect(x, y, GRID_STEP, GRID_STEP);
                    }
                }
            }
        };

        window.addEventListener('resize', resize);
        resize();

        const mouse = new THREE.Vector2(-999, -999);
        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        const ctxAscii = asciiCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctxAscii) return;

        const tempCanvas = document.createElement('canvas');
        const tctx = tempCanvas.getContext('2d');

        let animationFrameId: number;
        let startTime = Date.now();

        const render = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            globe.rotation.y += 0.003;
            renderer.render(scene, camera);

            tempCanvas.width = width;
            tempCanvas.height = height;
            if (tctx) {
                tctx.drawImage(renderer.domElement, 0, 0);
                const data = tctx.getImageData(0, 0, width, height).data;

                ctxAscii.clearRect(0, 0, width, height);
                ctxAscii.font = `bold ${CELL_H}px monospace`; // Bold for better "pop"
                ctxAscii.textAlign = 'center';
                ctxAscii.textBaseline = 'middle';

                for (let y = 0; y < height; y += CELL_H) {
                    for (let x = 0; x < width; x += CELL_W) {
                        const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
                        const r = data[idx];
                        const g = data[idx + 1];
                        const b = data[idx + 2];
                        const a = data[idx + 3];
                        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

                        // Hover logic
                        const distToMouse = Math.sqrt((x - mouse.x) ** 2 + (y - mouse.y) ** 2);
                        const hoverBoost = Math.max(0, 1 - distToMouse / 250);

                        if (a > 20 && lum > 0.05) {
                            // High-vibrancy Color formula
                            const mx = Math.max(r, g, b, 1);
                            const nr = Math.min(255, (r / mx) * 255 * (1.2 + hoverBoost));
                            const ng = Math.min(255, (g / mx) * 255 * (1.2 + hoverBoost));
                            const nb = Math.min(255, (b / mx) * 255 * (1.2 + hoverBoost));

                            const pulse = 0.6 + Math.sin(elapsed * 2 + (x + y) * 0.005) * 0.4;
                            const sweepPos = (elapsed * 300) % (width + height);
                            const distToSweep = Math.abs(x + y - sweepPos);
                            const sweepEffect = Math.max(1, 2.5 - distToSweep / 100);

                            const charIdx = Math.floor((1 - lum) * (ASCII_RAMP.length - 1));
                            const char = ASCII_RAMP[charIdx];

                            // Higher opacity for "popping" effect
                            const baseAlpha = 0.4 + hoverBoost * 0.4;
                            ctxAscii.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${pulse * baseAlpha})`;
                            
                            if (sweepEffect > 1 || hoverBoost > 0.5) {
                                ctxAscii.fillStyle = `rgba(255, 255, 255, ${pulse * (0.6 + hoverBoost)})`;
                                ctxAscii.shadowBlur = 10 + hoverBoost * 20;
                                ctxAscii.shadowColor = `rgb(${nr}, ${ng}, ${nb})`;
                            } else {
                                ctxAscii.shadowBlur = 0;
                            }
                            ctxAscii.fillText(char, x + CELL_W / 2, y + CELL_H / 2);
                        } else {
                            // Subtler background dots
                            const dotAlpha = 0.05 + hoverBoost * 0.1;
                            ctxAscii.fillStyle = `rgba(100, 150, 255, ${dotAlpha})`;
                            ctxAscii.fillText('.', x + CELL_W / 2, y + CELL_H / 2);
                        }
                    }
                }
            }
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden bg-[#00040a] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
            <canvas ref={gridCanvasRef} className="absolute inset-0 z-0 opacity-20" />
            <canvas ref={asciiCanvasRef} className="absolute inset-0 z-20" />
            <div className="absolute inset-0 z-30 pointer-events-none crt opacity-[0.03]" />
        </div>
    );
}
