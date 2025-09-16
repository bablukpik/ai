import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...markdown.configs.processor,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": "off",
    },
  },
  {
    // For .ts file inside markdown code blocks
    files: ["**/*.md/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-empty": "off",
      "no-undef": "warn",
    },
    languageOptions: {
      globals: {
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        model: "readonly",
        console: "readonly",
        URL: "readonly",
        process: "readonly",
      },
    },
  },
);
