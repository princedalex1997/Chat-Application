// tailwind.config.js
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fira: ['"Fira Sans"', "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        cursive: ["cursive"],
      },
      fontSize: {
        custom: "1.2rem",
      },
      colors: {
        "custom-purple": "#8a2be2",
        "primary-brand": "#ff5733",
        dashboard: {
          bg: "#F9FAFB", // light gray background
          white: "#FFFFFF",
          border: "#E5E7EB",
          text: "#374151", // neutral dark
          primary: "#2563EB", // blue
          secondary: "#16A34A", // green
          danger: "#DC2626", // red
        },
      },
      screens: {
        tablet: "640px",
        laptop: "1024px",
        desktop: "1280px",
      },
      keyframes: {
        "truck-drive": {
          "0%": { transform: "translateX(-200%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        "truck-drive": "truck-drive 3s ease-in-out forwards",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".perspective": { perspective: "1000px" },
        ".backface-hidden": { backfaceVisibility: "hidden" },
        ".transform-style-preserve-3d": { transformStyle: "preserve-3d" },
        ".rotate-y-180": { transform: "rotateY(180deg)" },
        ".rotate-y-0": { transform: "rotateY(0deg)" },
      });
    },
    require("tailwind-scrollbar-hide"),
  ],
};
