import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        noir: {
          950: "#050506",
          900: "#0a0a0c",
          850: "#101013",
          800: "#16161a",
          700: "#1e1e24",
          600: "#2a2a32",
          500: "#3a3a44",
        },
        gold: {
          50: "#fbf7e8",
          100: "#f6edc8",
          200: "#eeda93",
          300: "#e6c65e",
          400: "#d4af37",
          500: "#c39a2a",
          600: "#a67c1f",
          700: "#7d5c17",
          800: "#523c0f",
          900: "#2e2109",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #f6edc8 0%, #d4af37 45%, #a67c1f 100%)",
        "noir-radial":
          "radial-gradient(ellipse at top, rgba(212,175,55,0.10), transparent 60%)",
        "grain":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(212,175,55,0.25), 0 8px 40px -8px rgba(212,175,55,0.25)",
        "gold-lg":
          "0 0 0 1px rgba(212,175,55,0.35), 0 20px 60px -12px rgba(212,175,55,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(212,175,55,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
