/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-background-color': "#1c1c1c",
        'page-default-text-color': "#ecebe3",

        'landing-timer-color': "#ebe712",
        'landing-text-color': "#ecebe3", 

        'navbar-text-color-normal': "#f4f4f4",
        'navbar-text-color-dark': "#e1d169",
        'navbar-background-color': "#3d29c2",
        
        'navbar-account-dropdown-background-color': "#ffffff",
        'navbar-account-dropdown-hover-color': "#06030a",
        'navbar-account-dropdown-text-color': "#000000",

        'signin-light': "#4444aa",
        'signin-text': "#ecebe3",
        'signin-text-header': "#d6d6ff",
        'signin-background-color': "#303030",
        'signin-provider-outline': "#4444aa",
        'signin-provider-hover-color': "#6565db",

        '404-text-color': "#ecebe3",
        '404-text-color-header': "#6666d8",
        '404-text-color-alternate': "#e9d23b",

        'user-profile-card-color': "#9999f6",
        'user-profile-text-color': "#f2f2f2",
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
