module.exports = {
    content: [
      './src/**/*.{njk,html,js}',
      './_includes/**/*.{njk,html,js}'
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: '#0f766e',
            700: '#065f46',
            500: '#10b981'
          }
        },
        fontFamily: {
          display: ['Playfair Display', 'serif'],
          body: ['Work Sans', 'system-ui', 'sans-serif']
        },
        grayscale: {
          50: '50%',
          100: '100%'
        }
      },
    },
    plugins: [],
  }