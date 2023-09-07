module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        colorCyan: '#00A2DF',
        colorCyan500: '#008c94',
        colorCyan800: '#00617b',
        colorBlue900: '#27394f',
        colorYellow400: '#f5de47',
        colorOrange700: '#ff9e10',
        colorRed950: '#c73e28',
        grayTone: '#878791',
        grayTone2: '#AFAFB4',
        grayTone3: '#D7D7DC',

        // Colores basicos
        white: '#F5F5FA',
        black: '#00000A',
        grey: '#373741',
      },

      fontFamily: {
        fontPrimaryBold: ['font-primary-bold'],
        fontPrimaryRegular: ['font-primary-regular'],
        fontPrimaryLight: ['font-primary-light'],
        fontSecondary: ['font-secondary'],
      },
      // Animaciones basicas
      keyframes: {
        'slide-right': {
          '0%': {
            transform: 'translateX(-10px)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
        'slide-left': {
          '0%': {
            transform: 'translateX(20px)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
        'slide-bottom': {
          '0%': {
            transform: 'translateY(-20px)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
      },
      animation: {
        'slide-right':
          'slide-right .8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-left':
          'slide-left .8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-bottom':
          'slide-bottom .8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
    },
  },
  variants: {
    borderWidth: ['responsive', 'hover', 'focus', 'active'],
  },
  plugins: [],
};
