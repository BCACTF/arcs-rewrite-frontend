/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-background-color': "#2e2c2c",
        
        'landing-timer-color': "#ebe712",
        'landing-text-color': "#ecebe3", 

        'navbar-text-color-normal': "#efefef",
        'navbar-text-color-dark': "#b5b4b4",
        'navbar-background-color': "#3d29c2",
        'navbar-dropdown-background-color': "#134c89",

        'signin-light': "#4444aa",
      },
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
      flexGrow: {
        '2': 2,
        '4': 4,
        '6': 6,
        '8': 8,
        '10': 10,
        '12': 12,
      },
    },
  },
  plugins: [],
}
