/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "rgb(31, 162, 35)",

          "secondary": "#ffffff",

          "accent": "#67CBA0",

          "neutral": "#181A2A",

          "base-100": "#FFFFFF",

          "info": "#3ABFF8",

          "success": "#36D399",

          "warning": "#FBBD23",

          "error": "#F87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}

