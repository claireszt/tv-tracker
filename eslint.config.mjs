import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser,
    },
    plugins: {
      react,
      prettier,
    },
    rules: {
      // ✅ Code Quality & Best Practices
      "no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-unused-expressions": "error",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      "newline-before-return": "warn",
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
