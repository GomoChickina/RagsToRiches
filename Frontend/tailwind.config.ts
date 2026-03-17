/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Background: Deep Forest (Keep this, it's good)
        background: '#022c22', // Emerald 950
        
        // 2. Primary: BRIGHT Mint Green (High Contrast for Buttons)
        primary: '#34d399',    // Emerald 400 (Much brighter than before)
        'primary-hover': '#10b981', // Emerald 500
        
        // 3. Secondary: Glassy / Deep Green
        secondary: '#064e3b',  // Emerald 900
        card: '#065f46',       // Emerald 800
        
        // 4. Text
        'text-main': '#ffffff', // Pure White for readability
        'text-muted': '#a7f3d0', // Emerald 200 (Soft Green)
        
        // 5. Money Gold
        gold: '#fbbf24', 
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}