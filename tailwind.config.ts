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
        light: {
          background: "#f5f5f5",
          text: "#2a2a2a",
          border: "#d9d9d9",
          surface: "#f1f1f1",
          primary: "#a78bfa",
          secondary: "#f472b6",
          accent: "#65d7ae",
        },
        dark: {
          background: "#1a1a1a",
          text: "#f5f5f5",
          border: "#2a2a2a",
          surface: "#222222",
          primary: "#8f6bea",
          secondary: "#e45ca4",
          accent: "#2bbf87",
        },
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
      letterSpacing: {
        wider: "0.02em", // 2% letter spacing
      },
    },
  },
  plugins: [],
} satisfies Config;
