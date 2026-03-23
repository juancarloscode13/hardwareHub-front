/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['JetBrains Mono Variable', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        heading: ['Space Grotesk Variable', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono Variable', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

