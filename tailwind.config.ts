import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        accent: "#FC062D",
        appleLight: {
          bg: "#FFFFFF",
          secondaryBg: "#F2F2F7",
          text: "#000000"
        },
        appleDark: {
          bg: "#000000",
          secondaryBg: "#1C1C1E",
          text: "#FFFFFF"
        }
      }
    }
  },
  plugins: []
};
export default config;
