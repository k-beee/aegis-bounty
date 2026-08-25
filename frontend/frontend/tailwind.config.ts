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
        background: "#05070c",
        surface: "#0d1422",
        card: "#121b2d",
        border: "#1e2c44",
        cyanAccent: "#00f0ff",
        emeraldAccent: "#00ffaa",
        roseAccent: "#ff0055",
        amberAccent: "#ffaa00",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;
