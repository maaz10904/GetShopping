/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#20161F",
          lighter: "#2A1D28",
        },
        surface: {
          DEFAULT: "#2F211C",
          lighter: "#3B2A22",
        },
        primary: {
          DEFAULT: "#DB924B",
          foreground: "#20161F",
        },
        secondary: "#263E3F",
        accent: "#10576D",
        neutral: "#120C12",
        text: {
          primary: "#F7EEE6",
          secondary: "#BCAAA0",
          muted: "#8F7B72",
        },
      },
    },
  },
  plugins: [],
}
