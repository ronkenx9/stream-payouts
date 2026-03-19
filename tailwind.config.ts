import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99', filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.8))' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4', filter: 'none' }
        }
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        flicker: 'flicker 3s linear infinite'
      }
    },
  },
  plugins: [],
};
export default config;
