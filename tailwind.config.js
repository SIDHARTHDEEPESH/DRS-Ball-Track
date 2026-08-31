/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        magical: ['"Cinzel Decorative"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        parchment: ['"IM Fell DW Pica"', 'serif'],
        medieval: ['MedievalSharp', 'cursive'],
        fraktur: ['UnifrakturMaguntia', 'cursive'],
      },
      colors: {
        hogwarts: {
          dark: '#08060c',
          card: 'rgba(23, 16, 38, 0.75)',
          gold: '#d4af37',
          goldLight: '#f3e5ab',
          bronze: '#9c5221',
          gryffindor: '#740001',
          gryffindorGold: '#eeba30',
          slytherin: '#1a472a',
          slytherinSilver: '#aaaaaa',
          ravenclaw: '#0e1a40',
          ravenclawBronze: '#946b2d',
          hufflepuff: '#ecb939',
          hufflepuffBlack: '#372e29',
        }
      },
      boxShadow: {
        'magical-gold': '0 0 25px -5px rgba(212, 175, 55, 0.45)',
        'magical-glow': '0 0 35px 2px rgba(238, 186, 48, 0.25)',
        'spell-fire': '0 0 20px 4px rgba(116, 0, 1, 0.45)',
      }
    },
  },
  plugins: [],
}
