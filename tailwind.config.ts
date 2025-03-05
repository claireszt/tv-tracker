import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fe470a",
        secondary: "#ffb51f",
        accent: "#ff789f",
        error: "#e93b3b",

        // Light Theme
        light: {
          background: "#ffffff",
          text: "#121212",
          border: "#d9d9d9",
          surface: "#f5f5f5",
        },

        // Dark Theme
        dark: {
          background: "#0f0f0f",
          text: "#f5f5f5",
          border: "#2a2a2a",
          surface: "#1a1a1a",
        },

        // Button Variants
        "button-primary-hover": "#ff5c2b",
        "button-primary-disabled": "#ffaa85",
        "button-secondary-hover": "#ffc733",
        "button-secondary-disabled": "#ffe5a1",
        "button-accent-hover": "#ff8ab3",
        "button-accent-disabled": "#f4c3d9",
      },

      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.75rem", // 28px
        "4xl": "2rem", // 32px
        "5xl": "2.25rem", // 36px
        "6xl": "3rem", // 48px
      },

      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
      },

      borderRadius: {
        none: "0rem",
        "rounded-1": "0.625rem", // 10px
        "rounded-2": "0.8125rem", // 13px
      },

      spacing: {
        xs: "4px",
        s: "8px",
        m: "16px",
        l: "24px",
        xl: "32px",
        xxl: "64px",
      },

      screens: {
        mobile: "375px",
        tablet: "768px",
        desktop: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
