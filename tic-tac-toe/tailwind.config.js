// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        amarante: ['Amarante', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        "gradient-shift": {
        "0%, 100%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        }
      },
      animation: {
        gradient: "gradient-shift 15s ease infinite",
      },
    },
  },
}
