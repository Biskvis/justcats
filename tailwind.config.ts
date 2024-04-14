import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'custom-dark': '#001427',
        'custom-yellow': '#f4d58d',
        'custom-blue': '#708d81',
        'custom-orange': '#fb8500',
        'custom-lightblue': '#8ecae6',
        'custom-red': '#bf0603',
        'custom-cherry': '#8d0801',
        'custom-dark1': 'rgb(4 30 49)'
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "bumblebee"],
  },
};
export default config;
