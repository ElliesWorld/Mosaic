/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mosaic color palette - modern pastels
        mosaic: {
          sage: '#B4C7B4',      // Memory Bank
          blue: '#A8DADC',      // Calendar
          lavender: '#C7B8EA',  // Notes
          peach: '#FFB5A7',     // Shopping Lists
          mint: '#B8E0D2',      // TODO
          coral: '#FF6B6B',     // Urgent markers
        },
        priority: {
          normal: '#6BCF7F',    // Green star
          medium: '#FFD93D',    // Yellow star
          urgent: '#FF6B6B',    // Red star
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}