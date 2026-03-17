/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0D0A07',
          surface: '#161209',
          card: '#1E1710',
          hover: '#252015',
          border: '#2E2618',
        },
        amber: {
          glow: '#F0A500',
          soft: '#C8832A',
          muted: '#7A5520',
          faint: '#3A2810',
        },
        text: {
          primary: '#F5F0E8',
          secondary: '#A89880',
          muted: '#6B6355',
          faint: '#3D3630',
        },
      },
      fontFamily: {
        serif: ['Instrument_Serif', 'Georgia', 'serif'],
        sans: ['DM_Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
