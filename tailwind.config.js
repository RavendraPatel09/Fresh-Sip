/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fresh: {
          bg: "#FFFDF8",
          green: "#52A447",
          greenLight: "#E8F5E9",
          orange: "#FF8A24",
          orangeLight: "#FFF3E0",
          yellow: "#FFC83D",
          pink: "#FF6F91",
          pinkLight: "#FCE4EC",
          charcoal: "#171717",
          gray: "#666666",
          softBg: "#F9F6F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glow-orange": "0 0 35px -5px rgba(255, 138, 36, 0.4)",
        "glow-green": "0 0 35px -5px rgba(82, 164, 71, 0.4)",
      },
    },
  },
  plugins: [],
};
