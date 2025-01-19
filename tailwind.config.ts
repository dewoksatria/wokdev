import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'flicker': 'flicker 0.15s infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '0.1' },
          '100%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
