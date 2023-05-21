/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-background-color': "#efefef",
        'page-default-text-color': "#121212",
        
        "main-color": {
          "300": "#afa332",
          "500": "#837a29",
          "700": "#726a20"
        },

        'landing-timer-color': "#5d5d5d",
        'landing-text-color': "#000000", 

        'navbar-text-color-normal': "#121212",
        'navbar-text-color-dark': "#ad250a",
        'navbar-background-color': "#919191",
        'navbar-background-color-mobile-only': "#e07e73",

        'navbar-account-dropdown-background-color': "#606060",
        'navbar-account-dropdown-background-color-hover': "#c36e58",
        'navbar-account-dropdown-hover-color': "#b86753",
        'navbar-account-dropdown-text-color': "#e5e5e5",

        'signin-light': "#b85454",
        'signin-text': "#141414",
        'signin-text-header': "#6a2524",
        'signin-background-color': "#ffbbbb",
        'signin-provider-outline': "#c10300",
        'signin-provider-hover-color': "#eaa3a2",
        'signin-provider-hover-color-light': "#7F7FDC",

        '404-text-color': "#d30606",
        '404-text-color-header': "#430101",
        '404-text-color-alternate': "#523232",
        '404-bar-colors': "#010c13",

        'user-profile-card-color': "#ff230f",
        'user-profile-text-color': "#1a1a1a",
        'user-profile-button-background-color': "#ff9494",
        'user-profile-button-border-color': "#0c0808",
        'user-profile-button-text-color': "#1a1a1a",
        'user-profile-create-team-background-color': "#008d0c",
        'user-profile-join-team-background-color': "#0030a8",
        'user-profile-no-team-background-color': "#3d3d3d",
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
      borderRadius: {
        'md/sm': '0.25rem'
      }
    },
  },
  plugins: [],
}
