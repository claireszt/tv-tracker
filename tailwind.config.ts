import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
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
        // Desktop Headings
        h1: ["48px", { lineHeight: "120%", fontWeight: "700" }],
        h2: ["36px", { lineHeight: "120%", fontWeight: "600" }],
        h3: ["28px", { lineHeight: "120%", fontWeight: "500" }],

        // Mobile Headings
        "h1-mobile": ["32px", { lineHeight: "120%", fontWeight: "700" }],
        "h2-mobile": ["24px", { lineHeight: "120%", fontWeight: "600" }],
        "h3-mobile": ["20px", { lineHeight: "120%", fontWeight: "500" }],

        // Body Text
        "body-lg": ["18px", { lineHeight: "150%", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "150%", fontWeight: "400" }],

        // Mobile Body Text
        "body-lg-mobile": ["16px", { lineHeight: "150%", fontWeight: "400" }],
        "body-sm-mobile": ["14px", { lineHeight: "150%", fontWeight: "400" }],

        // Buttons
        button: ["16px", { lineHeight: "100%", fontWeight: "600" }],
        "button-mobile": ["14px", { lineHeight: "100%", fontWeight: "600" }],

        // Captions
        caption: ["12px", { lineHeight: "120%", fontWeight: "400" }],
        "caption-mobile": ["12px", { lineHeight: "120%", fontWeight: "400" }],
      },

      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
      },

      borderRadius: {
        none: "0rem",
        sm: "0.625rem", // 10px
        md: "0.8125rem", // 13px
        lg: "1rem", // 16px
      },

      spacing: {
        xs: "4px",
        s: "8px",
        sm: "12px",
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
