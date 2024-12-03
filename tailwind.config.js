/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      dark: '#0B162C',
      light: '#FFFFFF',
      accent: '#5FC2BA',
      midnight: '#1C2942',
      lightnight: '#3B556D',
      firstCard: '#fecaca',
      secondCard: '#d9f99d',
      thirdCard: '#c7d2fe',
      fourthCard: '#bbf7d0',
    },

    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
