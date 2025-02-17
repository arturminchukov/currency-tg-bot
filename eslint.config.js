import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticJs from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...{
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      "@stylistic/js/object-curly-spacing": ["error", "never"],
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/indent": ["error", 4],
    }
  }
];