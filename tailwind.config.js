/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['var(--font-poppins)'],
                inter: ['var(--font-inter)']
            },
            fontSize: {
                'xs': '14px',
                'sm': '16px',
                'md': '24px',
                'lg': '36px',
                'xl': '42px'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            screens: {
                'xs': '320px',   // Custom extra small screen
                'sm': '480px',   // Max Mobile Scren
                'md': '769px',   // Tab screen
                'lg': '1024px',  // Max Tab Screen
                'xl': '1280px',  // Desktop Screen
                '2xl': '1536px', // Custom double extra large screen
            },
            colors: {
                'primary': '#6647FF',
                'primary-500': '#6744FF',
                'secondary': '#F3F2FF',
                'neutral-900': '#18191A',
                'neutral-800': '#242526',
                'neutral-700': '#3A3B3C',
                'gray-dark': '#525252',
                'gray': '#8492a6',
                'gray-light': '#d3dce6',
                'gray-1': '#737373',
                'border': '#D4D4D4',
            },

        },
    },
    plugins: [],
}
