/** @type {import('tailwindcss').Config} */

const text = "#f7f6f8";
const background = "#111119";
const primary = "#985ace";
const secondary = "#261a32";
const accent = "#0f88de";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-background-color': background,
        'page-default-text-color': text,
        
        "main-color": {
          "300": primary,
          "500": primary/70,
          "700": primary/90
        },

        'landing-timer-color': primary,
        'landing-text-color': primary, 

        'navbar-event-name': primary,
        'navbar-text-color-normal': text,
        'navbar-text-color-dark': primary,
        'navbar-background-color': secondary,
        'navbar-background-color-mobile-only': secondary,

        'navbar-account-dropdown-background-color': primary,
        'navbar-account-dropdown-background-color-hover': accent,
        'navbar-account-dropdown-hover-color': "rgb(171, 205, 234)",
        'navbar-account-dropdown-text-color': "#000000",

        'signin-light': accent,
        'signin-text': text,
        'signin-text-header': text,
        'signin-background-color': secondary,
        'signin-provider-outline': text,
        'signin-provider-hover-color': accent,
        'signin-provider-hover-color-light': primary,
        'signin-button-hover-text-color': text,
        'signin-button-text-color': text,
        'signin-button-background-color': secondary,
        'border-signin-button-border-color': text,
        'border-signin-button-ifthethingisdisabledshowthis-background-color': text,

        '404-text-color': text,
        '404-text-color-header': primary,
        '404-text-color-alternate': accent,

        'user-profile-card-color': secondary,
        'user-profile-text-color': text,
        'user-profile-button-background-color': primary,
        'user-profile-button-border-color': secondary,
        'user-profile-button-text-color': text,
        'user-profile-create-team-background-color': "#008d0c", // TODO 
        'user-profile-join-team-background-color': accent,
        'user-profile-no-team-background-color': secondary,

        'team-line-color': accent,
        'team-team-name-color': primary,
        'team-boxes-background-color': secondary,
        'team-boxes-border-color': accent,
        'team-boxes-text-color': text,
        'team-entry-hover-color': accent,

        'leaderboard-row-hover-color': accent,
        'leaderboard-leaderboard-header-color': "#000000", // this isn't used anywhere
        'leaderboard-firstplace-number-color': text,
        'leaderboard-secondplace-number-color': text,
        'leaderboard-thirdplace-number-color': text,
        'leaderboard-number-color': text,
        'leaderboard-divider-color': secondary,

        'rules-header-color': primary,
        'rules-subheader-color': accent,
        'rules-divider-color': accent,
        'rules-link-color': primary,
        'rules-link-hover-color': accent,

        'about-header-color': primary,
        'about-subheader-color': accent,
        'about-divider-color': accent,
        'about-link-color': primary,
        'about-link-hover-color': accent,

        'play-selector-box-outline-color': accent,
        'play-selector-line-divider-color': accent,
        
        'play-button-default-text-color': text,
        'play-button-outline-color': accent,
        'play-button-selected-outline-color': accent,

        'play-button-hover-unselected-fill-color': accent,
        'play-button-hover-unselected-text-color': text,
        
        'play-button-hover-selected-fill-color': secondary,
        'play-button-hover-selected-text-color': text,

        'play-button-selected-fill-color': accent,
        'play-button-selected-text-color': text,
      
        'play-pointselector-dot-color-active': primary,
        'play-pointselector-dot-color-inactive': secondary,
        'play-pointselector-default-line-color': secondary, // for the most part, you want this to be the same as inactive dot color


        'chall-hover-default-shadow-color': "#d5b900",      // doesn't do anything right now
        'chall-hover-transition-shadow-color': "#eb0000",   // doesn't do anything right now
        'chall-solved-side-color': "#26b434",
        'chall-unsolved-side-color': background,
        'chall-drop-header-background-color': secondary,
        'chall-border-color': accent,
        'chall-background-color': secondary,
        'chall-text-color': text,
        'chall-author-name-color': text,
        'chall-divider-color': accent,
        'chall-nc-background-color': "#464646",
        'chall-nc-border-color': accent,
        'chall-nc-text-color': accent,
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
