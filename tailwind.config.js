export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#f4f7f5",
          100: "#ebf1ed",
          200: "#d6e2db",
          300: "#b5c7bd",
          400: "#86a092",
          500: "#526b5d",
          600: "#364c40",
          700: "#22352b",
          800: "#13241b",
          900: "#0b1a11",
          950: "#050e09",
        },
        surface: {
          obsidian: "#050e09",
          forest: "#0b1a11",
          sage: "#f4f7f5",
          alabaster: "#ffffff",
        },
        hairline: {
          light: "rgba(4, 120, 87, 0.12)",
          dark: "rgba(52, 211, 153, 0.12)",
        },
        governance: {
          light: "#0f766e",
          hover: "#115e59",
          dark: "#2dd4bf",
          "dark-hover": "#5eead4",
        },
        ai: {
          light: "#15803d",
          hover: "#166534",
          dark: "#4ade80",
          "dark-hover": "#86efac",
        },
        status: {
          "amber-light": "#92400e",
          "amber-hover": "#78350f",
          "amber-dark": "#fbbf24",
          "amber-dark-hover": "#fcd34d",
        },
      },
    },
  },
  plugins: [],
}
