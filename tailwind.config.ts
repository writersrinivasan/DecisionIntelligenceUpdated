import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        pulseRing: { "0%": { boxShadow: "0 0 0 0 rgba(99,102,241,.55)" }, "100%": { boxShadow: "0 0 0 14px rgba(99,102,241,0)" } },
        dash: { to: { strokeDashoffset: "-20" } },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        pulseRing: "pulseRing 1.2s ease-out infinite",
        dash: "dash 1s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
