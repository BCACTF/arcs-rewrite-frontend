/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minWidth: {
        '30': "30rem",
        '60': "60rem",
        '15': "15rem",
      },
      maxWidth: {
        '100': "100rem",
        '50': "50rem",
        '25': "25rem",
        'full': "100%",
      },
      width: {
        'screen/2': "50vw",
        'screen/5': "20vw",
      },
      height: {
        '39': "9.75rem",
      },
      minHeight: {
        '60': "15rem",
      },
      borderColor: {
        'spacer-dropdown': "#525c69",
      },
      borderWidth: {
        '3': '3px'
      },
      translate: {
        '1.25': '0.375rem'
      },
      rotate: {
        '135': '135deg'
      },
      backgroundColor: {
        'signin-light': "#4444aa",
        'dropdown-main': "#382894",
        'dropdown-secondary': "#291f66",
      },
      flexGrow: {
        '2': 2,
        '4': 4,
        '6': 6,
        '8': 8,
        '10': 10,
        '12': 12,
      }
    },
  },
  plugins: [],
}
