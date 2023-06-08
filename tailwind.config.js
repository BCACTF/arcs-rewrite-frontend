/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-background-color': "#d0c5ac",
        'page-default-text-color': "#131313",
        
        "main-color": {
          "300": "#89cac8",
          "500": "#6695bf",
          "700": "#4969b7"
        },

        'landing-timer-color': "#255eee",
        'landing-text-color': "#db4838", 

        'navbar-event-name': '#f4f4f4',
        'navbar-text-color-normal': "#f4f4f4",
        'navbar-text-color-dark': "#db4838",
        'navbar-background-color': "rgb(10, 61, 104)",
        'navbar-background-color-mobile-only': "rgb(10, 61, 104)",

        'navbar-account-dropdown-background-color': "#ffffff",
        'navbar-account-dropdown-background-color-hover': "#89cac8",
        'navbar-account-dropdown-hover-color': "rgb(171, 205, 234)",
        'navbar-account-dropdown-text-color': "#000000",

        'signin-light': "#89cac8",
        'signin-text': "#ffffff",
        'signin-text-header': "#ffffff",
        'signin-background-color': "rgb(10, 61, 104)",
        'signin-provider-outline': "#ffffff",
        'signin-provider-hover-color': "#db4838",
        'signin-provider-hover-color-light': "#89cac8",
        'signin-button-hover-text-color': "#ffffff",
        'signin-button-text-color': "#ffffff",
        'signin-button-background-color': "rgb(10, 61, 104)",
        'border-signin-button-border-color': "#ffffff",
        'border-signin-button-ifthethingisdisabledshowthis-background-color': "#ffffff",

        '404-text-color': "#000000",
        '404-text-color-header': "#db4838",
        '404-text-color-alternate': "#255eee",

        'user-profile-card-color': "#89cac856",
        'user-profile-text-color': "#131313",
        'user-profile-button-background-color': "#4969b7",
        'user-profile-button-border-color': "#557ad6",
        'user-profile-button-text-color': "#fcfbfb",
        'user-profile-create-team-background-color': "#008d0c", // TODO 
        'user-profile-join-team-background-color': "#0030a8",
        'user-profile-no-team-background-color': "#3d3d3d",

        'team-line-color': "#ffffff",
        'team-team-name-color': "#db4838",
        'team-boxes-background-color': "rgb(10, 61, 104)",
        'team-boxes-border-color': "#ffffff",
        'team-boxes-text-color': "#ffffff",
        'team-entry-hover-color': "rgb(171, 205, 234)",

        'leaderboard-row-hover-color': "#89cac8",
        'leaderboard-leaderboard-header-color': "#000000", // this isn't used anywhere
        'leaderboard-firstplace-number-color': "#002a8c",
        'leaderboard-secondplace-number-color': "#255eee",
        'leaderboard-thirdplace-number-color': "#6695bf",
        'leaderboard-number-color': "#2c3437",
        'leaderboard-divider-color': "#787c84",

        'rules-header-color': "#db4838",
        'rules-subheader-color': "#255eee",
        'rules-divider-color': "rgb(10, 61, 104)",
        'rules-link-color': "#db4838",
        'rules-link-hover-color': "#255eee",

        'about-header-color': "#db4838",
        'about-subheader-color': "#255eee",
        'about-divider-color': "rgb(10, 61, 104)",
        'about-link-color': "#db4838",
        'about-link-hover-color': "#255eee",

        'play-selector-box-outline-color': "#255eee",
        'play-selector-line-divider-color': "#255eee",
        
        'play-button-default-text-color': "rgb(10, 61, 104)",
        'play-button-outline-color': "rgb(10, 61, 104)",
        'play-button-selected-outline-color': "rgb(10, 61, 104)",

        'play-button-hover-unselected-fill-color': "#db4838",
        'play-button-hover-unselected-text-color': "#db4838",
        
        'play-button-hover-selected-fill-color': "#255eee",
        'play-button-hover-selected-text-color': "#255eee",

        'play-button-selected-fill-color': "#255eee",
        'play-button-selected-text-color': "#255eee",
      
        'play-pointselector-dot-color-active': "#db4838",
        'play-pointselector-dot-color-inactive': "#7e7e7e",
        'play-pointselector-default-line-color': "#7e7e7e", // for the most part, you want this to be the same as inactive dot color


        'chall-hover-default-shadow-color': "#d5b900",      // doesn't do anything right now
        'chall-hover-transition-shadow-color': "#eb0000",   // doesn't do anything right now
        'chall-solved-side-color': "#26b434",
        'chall-unsolved-side-color': "#3f3f3f",
        'chall-drop-header-background-color': "rgb(10, 61, 104)",
        'chall-border-color': "#ffffff",
        'chall-background-color': "rgba(10, 62, 104, 0.701)",
        'chall-text-color': "#ffffff",
        'chall-author-name-color': "#ffffff",
        'chall-divider-color': "#ffffff",
        'chall-nc-background-color': "#464646",
        'chall-nc-border-color': "#89cac89e",
        'chall-nc-text-color': "#89cac8",
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
        '30': "30rem",
        'full': "100%",
      },
      width: {
        'screen/2': "50vw",
        'screen-2/5': "40vw",
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
        '135': '135deg',
        '60': '60deg',
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
