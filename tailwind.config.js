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
                'destructive-800': '#991B1B',
                // Book-demo specific colors
                "error-container": "#ffdad6",
                "surface-dim": "#c4dcff",
                "on-primary-fixed-variant": "#4300da",
                "inverse-surface": "#19324d",
                "on-tertiary-fixed": "#2a1700",
                "surface-container": "#e5eeff",
                "surface-bright": "#f8f9ff",
                "inverse-on-surface": "#eaf1ff",
                "tertiary-fixed-dim": "#ffb95c",
                "outline-variant": "#c9c4d9",
                "error": "#ba1a1a",
                "on-secondary-fixed-variant": "#303f93",
                "glass-stroke": "rgba(255, 255, 255, 0.4)",
                "tertiary-fixed": "#ffddb7",
                "surface-variant": "#d2e4ff",
                "on-secondary-fixed": "#000f5d",
                "on-primary": "#ffffff",
                "surface-soft": "#F8F9FB",
                "background": "#f8f9ff",
                "on-primary-container": "#ede7ff",
                "on-error-container": "#93000a",
                "mesh-purple-end": "rgba(113, 127, 215, 0.02)",
                "surface-container-low": "#eff4ff",
                "glass-fill": "rgba(255, 255, 255, 0.7)",
                "inverse-primary": "#c8bfff",
                "primary-fixed-dim": "#c8bfff",
                "surface-white": "#FFFFFF",
                "on-secondary-container": "#263589",
                "on-tertiary-fixed-variant": "#653e00",
                "surface": "#f8f9ff",
                "on-surface": "#001c37",
                "on-tertiary-container": "#ffe7ce",
                "on-primary-fixed": "#1a0064",
                "mesh-purple-start": "rgba(103, 68, 255, 0.08)",
                "primary-fixed": "#e5deff",
                "on-secondary": "#ffffff",
                "tertiary-container": "#945e00",
                "secondary-fixed-dim": "#bbc3ff",
                "on-background": "#001c37",
                "primary-container": "#6744ff",
                "surface-container-high": "#dce9ff",
                "on-error": "#ffffff",
                "secondary-fixed": "#dee0ff",
                "surface-container-lowest": "#ffffff",
                "on-tertiary": "#ffffff",
                "tertiary": "#734800",
                "on-surface-variant": "#484556",
                "surface-container-highest": "#d2e4ff",
                "surface-tint": "#5b34f4",
                "outline": "#787588",
                "secondary-container": "#94a2fd"
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