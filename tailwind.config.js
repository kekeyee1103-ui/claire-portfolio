/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      colors: {
        ink: '#0C0C0C',
        platinum: '#EFE9DC',
        gold: {
          DEFAULT: '#C9A24B',
          bright: '#E8CD8A',
          deep: '#8C6F24',
        },
      },
    },
  },
  plugins: [],
};
