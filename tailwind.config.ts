import { type Config } from "tailwindcss";
import typeography from "@tailwindcss/typography";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary100: "#8B0000",
        primary200: "#c2402a",
        primary300: "#feded3",
        accent100: "#FF6347",
        accent200: "#8d0000",
        text100: "#000000",
        text200: "#565656",
        bg100: "#E9E9E9",
        bg200: "#dfdfdf",
        bg300: "#b7b7b7",

        //THESE ARE THE SAME
        // darkPrimary100: '#8B0000',
        // darkPrimary200: '#c2402a',
        // darkPrimary300: '#feded3',
        // darkAccent100: '#FF6347',
        // darkAccent200: '#8d0000',
        darkText100: "#FFFFFF",
        darkText200: "#CCCCCC",
        darkBg100: "#222222",
        darkBg200: "#333333",
        darkBg300: "#444444",
      },
    },
  },
  plugins: [typeography],
} satisfies Config;
