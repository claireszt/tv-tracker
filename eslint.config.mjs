import pluginNext from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";

export default [
  {
    name: "ESLint Config - nextjs",
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser,
      globals: {
        process: "readonly",
        fetch: "readonly",
        console: "readonly",
        URL: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": pluginNext,
      react,
      prettier,
    },
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,

      // ✅ Code Quality & Best Practices
      "no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-unused-expressions": "error",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // 🔠 Naming Conventions
      camelcase: [
        "error",
        { properties: "never", ignoreDestructuring: false, allow: ["Geist_Mono"] },
      ],

      // 🎨 Code Style (Prettier)
      "prettier/prettier": "error",

      // ⚛️ React-Specific Rules
      "react/jsx-pascal-case": "error",
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/build/**",
      "**/.eslintcache/**",
      "**/coverage/**",
      "**/public/**",
    ],
  },
];
