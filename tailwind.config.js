// tailwind.config.js
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      // залишаємо дефолтні…
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // …та додаємо власний на 1920px:
      "3xl": "1920px",
    },
    extend: {},
  },
  plugins: [
    aspectRatio,
    // за потреби можна додавати ще інші плагіни
  ],
};
