/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        
        // ✅ CORRECTION : Utilisation de l'objet avec DEFAULT
        // Cela permet d'utiliser 'bg-primary' ET theme('colors.primary.DEFAULT')
        primary: {
          DEFAULT: '#1a936f',
          dark: '#147a5c',
        },
        
        secondary: {
          DEFAULT: '#22c55e',
          dark: '#16a34a',
        },
        
        accent: {
          DEFAULT: '#ff6b35',
          dark: '#e65a2b',
        },
        
        dark: '#1a1a1a',
        light: '#f8fffe',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.slate.700'),
            // ✅ Utilise maintenant la syntaxe correcte
            '--tw-prose-headings': theme('colors.primary.DEFAULT'), 
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.slate.900'),
            '--tw-prose-bullets': theme('colors.primary.DEFAULT'),
            '--tw-prose-quotes': theme('colors.slate.900'),
            '--tw-prose-code': theme('colors.slate.900'),
            '--tw-prose-hr': theme('colors.slate.200'),
            blockquote: {
              borderLeftColor: theme('colors.primary.DEFAULT'),
              backgroundColor: theme('colors.slate.50'),
              fontStyle: 'italic',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}