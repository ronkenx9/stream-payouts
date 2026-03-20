"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ASCII_RAMP = "@#S08Xox+=;:-,. ";
const CELL_W = 10;
const CELL_H = 12;
const GRID_STEP = 24;

// Mapping names/continents to distinct colors
const COLORS = {
    ocean: '#000814',
    na: '#3a86ff', // Azure
    sa: '#ff006e', // Magenta
    eu: '#38b000', // Emerald
    af: '#ffbe0b', // Amber
    as: '#e01e37', // Crimson
    oc: '#fb5607', // Saffron
    an: '#ffffff'  // White
};

export default function AsciiPixelHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const asciiCanvasRef = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);
    const threeCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!asciiCanvasRef.current || !gridCanvasRef.current) return;

        const targetWidth = 600;
        const targetHeight = 600;
        
        // 1. Setup Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.z = 4.5;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            preserveDrawingBuffer: true 
        });
        renderer.setSize(targetWidth, targetHeight);
        renderer.setClearColor(0x000000, 0);

        // 2. Create Procedural World Map Texture
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = 1024;
        mapCanvas.height = 512;
        const mctx = mapCanvas.getContext('2d');
        if (mctx) {
            mctx.fillStyle = COLORS.ocean;
            mctx.fillRect(0, 0, 1024, 512);
            
            // Simplified continent shapes for demo
            const drawContinent = (x: number, y: number, w: number, h: number, color: string) => {
                mctx.fillStyle = color;
                mctx.beginPath();
                mctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
                mctx.fill();
            };

            // Rough placement
            drawContinent(250, 150, 120, 80, COLORS.na);  // NA
            drawContinent(320, 320, 70, 110, COLORS.sa);  // SA
            drawContinent(520, 120, 90, 60, COLORS.eu);   // EU
            drawContinent(550, 250, 80, 100, COLORS.af);  // AF
            drawContinent(750, 150, 150, 100, COLORS.as); // AS
            drawContinent(850, 350, 60, 50, COLORS.oc);   // OC
            drawContinent(512, 500, 450, 20, COLORS.an);  // AN
        }

        const texture = new THREE.CanvasTexture(mapCanvas);
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        const material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: 0,
            transparent: true,
            opacity: 1
        });
        
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // 3. Setup ASCII Canvases
        const asciiCanvas = asciiCanvasRef.current;
        const gridCanvas = gridCanvasRef.current;
        asciiCanvas.width = targetWidth;
        asciiCanvas.height = targetHeight;
        gridCanvas.width = targetWidth;
        gridCanvas.height = targetHeight;

        const ctxAscii = asciiCanvas.getContext('2d', { willReadFrequently: true });
        const ctxGrid = gridCanvas.getContext('2d');
        if (!ctxAscii || !ctxGrid) return;

        // Static Grid Overlay (Step 4)
        ctxGrid.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let x = 0; x < targetWidth; x += GRID_STEP) {
            for (let y = 0; y < targetHeight; y += GRID_STEP) {
                ctxGrid.strokeRect(x, y, GRID_STEP, GRID_STEP);
            }
        }

        let animationFrameId: number;
        let startTime = Date.now();

        const render = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            
            // Update 3D
            globe.rotation.y += 0.005;
            renderer.render(scene, camera);

            // Step 5: Process Frame (Sampling Renderer result)
            ctxAscii.clearRect(0, 0, targetWidth, targetHeight);
            
            // Get data from WebGL context buffer
            const frameCanvas = renderer.domElement;
            const imageData = renderer.getContext().canvas.getContext('2d')?.getImageData(0,0,targetWidth,targetHeight)
                || (renderer.domElement as any).getContext('2d')?.getImageData(0,0,targetWidth,targetHeight);
            
            // Fallback since WebGL contexts don't have getImageData easily without an offscreen buffer
            // We use the renderer.domElement directly into a temporary 2D canvas for extraction
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = targetWidth;
            tempCanvas.height = targetHeight;
            const tctx = tempCanvas.getContext('2d');
            if (!tctx) return;
            tctx.drawImage(frameCanvas, 0, 0);
            const data = tctx.getImageData(0, 0, targetWidth, targetHeight).data;

            ctxAscii.font = `${CELL_H}px monospace`;
            ctxAscii.textAlign = 'center';
            ctxAscii.textBaseline = 'middle';

            for (let y = 0; y < targetHeight; y += CELL_H) {
                for (let x = 0; x < targetWidth; x += CELL_W) {
                    const idx = (Math.floor(y) * targetWidth + Math.floor(x)) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const a = data[idx + 3];
                    
                    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

                    if (a > 50 && lum > 0.1) { // Subject threshold
                        // Normalized Color formula from Skill v1
                        const mx = Math.max(r, g, b, 1);
                        const nr = (r / mx) * 255;
                        const ng = (g / mx) * 255;
                        const nb = (b / mx) * 255;

                        // Sine wave pulse
                        const pulse = 0.8 + Math.sin(elapsed * 2 + (x + y) * 0.01) * 0.2;
                        
                        // Diagonal shine sweep
                        const sweepPos = (elapsed * 400) % (targetWidth * 2);
                        const distToSweep = Math.abs(x + y - sweepPos);
                        const sweepEffect = Math.max(1, 2.5 - distToSweep / 100);

                        const charIdx = Math.floor((1 - lum) * (ASCII_RAMP.length - 1));
                        const char = ASCII_RAMP[charIdx];

                        ctxAscii.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${pulse})`;
                        if (sweepEffect > 1) {
                            ctxAscii.fillStyle = `rgba(255, 255, 255, ${pulse})`;
                            ctxAscii.shadowBlur = 10;
                            ctxAscii.shadowColor = "white";
                        } else {
                            ctxAscii.shadowBlur = 0;
                        }

                        ctxAscii.fillText(char, x + CELL_W / 2, y + CELL_H / 2);
                    } else {
                        // Background dots (Simulated depth)
                        ctxAscii.fillStyle = 'rgba(40, 65, 100, 0.15)';
                        ctxAscii.fillText('.', x + CELL_W/2, y + CELL_H/2);
                    }
                }
            }
            
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-[600px] aspect-square mx-auto my-12 group perspective-[1000px]">
             {/* Hidden Three.js canvas for sampling */}
            <div className="hidden" ref={el => { if (el && threeCanvasRef.current) el.appendChild(threeCanvasRef.current) }} />

            {/* Layer 1: Atmospheric Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            
            {/* Layer 2: Grid Overlay */}
            <canvas ref={gridCanvasRef} className="absolute inset-0 z-10 pointer-events-none" />

            {/* Layer 3: ASCII Core */}
            <canvas 
                ref={asciiCanvasRef} 
                className="absolute inset-0 z-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-1000"
            />

            {/* Scanning Laser Line */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden opacity-10">
                <div className="w-full h-[2px] bg-white absolute top-[-100%] animate-[scan_4s_linear_infinite]" />
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            `}</style>
        </div>
    );
}
