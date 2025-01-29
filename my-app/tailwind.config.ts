import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // inspired from Fetch.com color theme
        primary: "#4B306A", // dark purple
        secondary: "#522751", // lighter purple for gradients
        highlight: "#F4A261", // orange accent color
        background: "#1A1325", // dark background
      },
    },
  },
  plugins: [],
} satisfies Config;
