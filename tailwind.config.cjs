require('dotenv').config()

const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        launchfast: '#8714BD',
      },
    },
    fontFamily: {
      display: [process.env.PUBLIC_FONT_NAME || 'Archivo', ...fontFamily.sans],
    },
  },
}
