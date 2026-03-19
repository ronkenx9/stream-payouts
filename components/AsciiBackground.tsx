"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ASCII_FRAMES = [
    `
    \\\\\\\\\\
     \\\\\\\\\\
      \\\\\\\\\\
       \\\\\\\\\\
  `,
    `
   ////////
  ////////
 ////////
////////
  `,
    `
    ||||||
    ||||||
    ||||||
    ||||||
  `,
    `
  --------
  --------
  --------
  --------
  `
];

// Complex wave animation
const generateWave = (t: number, width: number, height: number) => {
    let result = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const v = Math.sin(x * 0.2 + t) + Math.cos(y * 0.2 + t);
            if (v > 1.5) result += '#';
            else if (v > 0.5) result += '+';
            else if (v > -0.5) result += '-';
            else if (v > -1.5) result += '.';
            else result += ' ';
        }
        result += '\\n';
    }
    return result;
};

export default function AsciiBackground() {
    const [frame, setFrame] = useState('');

    useEffect(() => {
        let time = 0;

        // Check if window is wide enough for full effect, else reduce size
        const width = typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 100;
        const height = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 40;

        const interval = setInterval(() => {
            setFrame(generateWave(time, width, height));
            time += 0.1;
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-black flex item-center justify-center opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
            <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="ascii-text text-white/30 text-xs md:text-sm font-mono mt-20 ml-10"
            >
                {frame}
            </motion.pre>
            <div className="absolute inset-0 pointer-events-none crt" />
        </div>
    );
}
