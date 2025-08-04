/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Certifique-se de que o caminho cobre seus arquivos React
  ],
  theme: {
    extend: {}, // Você pode personalizar o tema aqui
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
