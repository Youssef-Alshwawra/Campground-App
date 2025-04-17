// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}"], // تحديث المسارات لاستخدام EJS
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
