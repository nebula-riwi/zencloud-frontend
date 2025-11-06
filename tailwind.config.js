/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e78a53',
        'primary-foreground': '#000000',
        secondary: 'oklch(0.536 0.0398 196.028)',
        'secondary-foreground': '#ffffff',
        background: 'oklch(0.1797 0.0043 308.1928)',
        foreground: 'oklch(0.8109 0 0)',
        card: 'oklch(0.1822 0 0)',
        'card-foreground': 'oklch(0.8109 0 0)',
        muted: 'oklch(0.252 0 0)',
        'muted-foreground': 'oklch(0.6268 0 0)',
        accent: 'oklch(0.3211 0 0)',
        'accent-foreground': 'oklch(0.8109 0 0)',
        border: 'oklch(0.252 0 0)',
        input: 'oklch(0.252 0 0)',
        ring: '#e78a53',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: 'calc(0.75rem - 2px)',
        sm: 'calc(0.75rem - 4px)',
      },
      animation: {
        'marquee': 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        'shiny-text': 'shiny-text 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
        'shiny-text': {
          '0%, 90%, 100%': { backgroundPosition: 'calc(-100px) 0' },
          '30%, 60%': { backgroundPosition: 'calc(100% + 100px) 0' },
        },
      },
    },
  },
  plugins: [],
}

