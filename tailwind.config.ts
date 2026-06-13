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
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          DEFAULT: "#4F46E5",
        },
        background: "#F8F9FF",
        border: "#E5E7EB",
        success: { DEFAULT: "#22C55E", light: "#F0FDF4" },
        warning: { DEFAULT: "#F59E0B", light: "#FFFBEB" },
        error: { DEFAULT: "#EF4444", light: "#FEF2F2" },
        info: { DEFAULT: "#3B82F6", light: "#EFF6FF" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "none",
        hover: "none",
        modal: "none",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        shake: "shake 0.38s ease-in-out",
        "pulse-danger": "pulseDanger 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.94) translateY(10px)" },
          to: { opacity: "1", transform: "scale(1)    translateY(0)" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%,60%": { transform: "translateX(-6px)" },
          "40%,80%": { transform: "translateX(6px)" },
        },
        pulseDanger: {
          "0%,100%": { borderColor: "rgba(239,68,68,0.3)" },
          "50%": { borderColor: "rgba(239,68,68,1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
