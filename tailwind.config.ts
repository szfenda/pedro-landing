import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors (from spec)
        'pedro-purple': '#6C5CE7',
        'pedro-lime': '#CCFF00',
        'pedro-pink': '#FF7675',
        'pedro-light': '#F7F9FC',
        'pedro-dark': '#2D3436',
      },
      fontFamily: {
        headline: ['var(--font-dela-gothic)', 'var(--font-archivo-black)', 'sans-serif'],
        body: ['var(--font-inter)', 'var(--font-outfit)', 'sans-serif'],
      },
      fontSize: {
        // Hero and section sizing
        'hero': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'h2': ['clamp(2.5rem, 5vw, 3.25rem)', { lineHeight: '1.1' }],
        'h3': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.2' }],
        'body': ['1.125rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      boxShadow: {
        // Hard shadows (neo-brutalism)
        'brutal-purple': '10px 10px 0 #6C5CE7',
        'brutal-lime': '10px 10px 0 #CCFF00',
        'brutal-dark': '10px 10px 0 #2D3436',
        'brutal-sm-purple': '6px 6px 0 #6C5CE7',
        'brutal-sm-lime': '6px 6px 0 #CCFF00',
        'brutal-lg-purple': '12px 12px 0 #6C5CE7',
        'brutal-lg-lime': '12px 12px 0 #CCFF00',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 1.2s infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'wave': 'wave 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
      },
      transitionTimingFunction: {
        'pedro': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      maxWidth: {
        'container': '1200px',
      },
      spacing: {
        'section': 'clamp(4rem, 8vw, 7.5rem)',
      },
    },
  },
  plugins: [],
}
export default config
