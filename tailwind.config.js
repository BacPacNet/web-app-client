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
            keyframes: {
                loader: {
                    to: {
                        opacity: 0.1,
                        transform: 'translate3d(0, -4px, 0)'
                    }
                },
                'caret-blink': {
                    '0%,70%,100%': {opacity: '1'},
                    '20%,50%': {opacity: '0'},
                },
            },
            animation: {
                'caret-blink': 'caret-blink 1.2s ease-out infinite',
                loader: 'loader 0.6s infinite alternate'
            },
            fontFamily: {
                poppins: ['var(--font-poppins)'],
                inter: ['var(--font-inter)']
            },
            fontSize: {
                '5xs': '4px',
                '4xs': '8px',
                '3xs': '10px',
                '2xs': '12px',
                'xs': '14px',
                'sm': '16px',
                '2sm': '18px',
                'md': '24px',
                'md-big': '28px',
                'lg-small': '32px',
                'lg': '36px',
                'xl': '40px'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            width: {
                'custom-width': '1058px',
            },
            screens: {
                'xs': '320px',   // Custom extra small screen
                'sm': '480px',   // Max Mobile Scren
                'md': '769px',   // Tab screen
                'lg': '1025px',  // Max Tab Screen
                'xl': '1280px',  // Desktop Screen
                '2xl': '1536px', // Custom double extra large screen
            },
            colors: {
                'primary': '#6647FF',
                'primary-300': '#B9B1FF',
                'primary-500': '#6744FF',
                'primary-700': '#3A169C',
                'primary-800': '#6400E6',
                'secondary': '#F3F2FF',
                'neutral-200': '#E5E7EB',
                'neutral-500': '#6B7280',
                'neutral-900': '#18191A',
                'neutral-800': '#242526',
                'neutral-700': '#3A3B3C',
                'neon': '#A544FF',
                'gray-dark': '#525252',
                'gray': '#8492a6',
                'gray-light': '#d3dce6',
                'gray-1': '#737373',
                'border': '#D4D4D4',
                'shade-button-border': '#E9E8FF',
                'surface-primary-50': '#F3F2FF',
                'surface-neutral-50': '#F9FAFB',
                'surface-neutral-100': '#F3F4F6',
                'warning-500': '#F59E0B',
                'success-500': "#22C55E",
                'success-100': '#DCFCE7',
                'success-800': '#166534',
                'destructive-50': '#FEF2F2',
                'destructive-100': '#FEE2E2',
                'destructive-200': '#FECACA',
                //'destructive-600': '#16A34A',
                'destructive-500': '#EF4444',
                'destructive-700': '#15803D',
                'destructive-600': "#DC2626",
                'destructive-800': '#991B1B'
            },
            dropShadow: {
                'card': '0px 2px 6px 0px rgba(16, 24, 40, 0.06)',
                'logo': '0px 8px 40px rgba(0, 0, 0, 0.10)'
            },
            boxShadow: {
                'small': '0px 2px 6px 0px rgba(16, 24, 40, 0.06)',
                'logo': '0px 0px 6px 0px #00000040',
                'medium': '0px 6px 15px -2px rgba(16, 24, 40, 0.08), 0px 6px 15px -2px rgba(16, 24, 40, 0.08);',
                'card': '0px 6px 15px -2px rgba(16, 24, 40, 0.08)',
                'button': '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04);',
                'popper': '0px 8px 24px -3px rgba(16, 24, 40, 0.05), 0px 8px 24px -3px rgba(16, 24, 40, 0.10);'
            }

        },
    },
    plugins: [
        function ({addUtilities}) {
            addUtilities({
                '.h-with-navbar': {
                    height: 'calc(100vh - 68px)',
                    '@media (max-width: 480px)': {
                        height: 'calc(100vh - 50px)', // Apply 40px when screen is mobile (max-width: 640px)
                    },
                },
                '.h-with-navbar-space': {
                    height: 'calc(100vh - 108px)',
                    '@media (max-width: 480px)': {
                        height: 'calc(100vh - 80px)', // Adjust this value as needed for mobile
                    },
                },
                '.max-width-allowed': {
                    maxWidth: "1058px"
                },
                '.max-width-tablet': {
                    maxWidth: "518px"
                },
            });
        },
    ],
}