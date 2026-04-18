/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        onyx: '#131515',
        graphite: '#2b2c28',
        verdigris: '#339989',
        'pearl-aqua': '#7de2d1',
        snow: '#fffafb',
      },
    },
  },
  plugins: [],
};
