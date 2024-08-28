const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#e0b687',
              light: '#efe2d2',
              dark: '#603f11',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#e0b687',
              light: '#603f11',
              dark: '#efe2d2',
            },
          },
        },
      },
    }),
  ],
};
