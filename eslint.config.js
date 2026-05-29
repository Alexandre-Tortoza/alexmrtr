import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    ignores: [".astro/**", "dist/**"],
  },

  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],

  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/comma-spacing": ["error", { before: false, after: true }],
      "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
      "@stylistic/space-infix-ops": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
      ],
    },
  },

  {
    files: ["**/*.mjs", "**/*.js"],
    ...js.configs.recommended,
  },
];
