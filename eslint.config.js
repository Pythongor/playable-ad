import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/typedef": [
        "error",
        {
          variableDeclaration: true,
          memberVariableDeclaration: true,
          parameter: true,
          propertyDeclaration: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "src/**/*.js"],
  },
];
