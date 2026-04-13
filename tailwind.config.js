/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        subtle: '#F8FAFC',
        line: '#E2E8F0',
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          soft: '#EFF6FF',
        },
        sun: '#ffde59',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 22px 50px -12px rgba(15, 23, 42, 0.08)',
        card: '0 4px 24px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
