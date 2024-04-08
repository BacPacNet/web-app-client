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
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            screens: {
                'xs': '320px',   // Custom extra small screen
                'sm': '640px',   // Custom small screen
                'md': '769px',   // Custom medium screen
                'lg': '1024px',  // Custom large screen
                'xl': '1280px',  // Custom extra large screen
                '2xl': '1536px', // Custom double extra large screen
            },
            colors: {
                'primary': '#6647FF',
                'secondary': '#F3F2FF',
                'pink': '#ff49db',
                'orange': '#ff7849',
                'green': '#13ce66',
                'yellow': '#ffc82c',
                'gray-dark': '#525252',
                'gray': '#8492a6',
                'gray-light': '#d3dce6',
            },

        },
    },
    plugins: [],
}
