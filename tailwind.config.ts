import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './Router.tsx',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './views/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
} satisfies Config;
