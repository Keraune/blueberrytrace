window.tailwind = window.tailwind || {};
window.tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
            },
            colors: {
                vlv: {
                    green: {
                        950: '#06281d',
                        900: '#0b3d2d',
                        800: '#10543e',
                        700: '#14724e',
                        600: '#1a8f5d',
                        500: '#27aa70',
                        100: '#dff5ea',
                        50: '#f1fbf6'
                    },
                    berry: {
                        800: '#6f1d47',
                        700: '#8b2457',
                        600: '#b83264',
                        500: '#d6467b',
                        100: '#ffe5ef',
                        50: '#fff4f8'
                    },
                    blueberry: {
                        900: '#1a255f',
                        700: '#263a8b',
                        500: '#445fe2',
                        100: '#e7ecff'
                    },
                    surface: '#ffffff',
                    background: '#f5f8f4',
                    muted: '#65766e'
                }
            },
            boxShadow: {
                vlv: '0 18px 44px rgba(15, 55, 39, 0.12)',
                'vlv-lg': '0 26px 70px rgba(9, 58, 39, 0.18)'
            },
            borderRadius: {
                'vlv-sm': '12px',
                'vlv-md': '18px',
                'vlv-lg': '24px',
                'vlv-xl': '32px'
            }
        }
    }
};
