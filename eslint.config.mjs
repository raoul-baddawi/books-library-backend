// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import eslintNestJs from "@darraghor/eslint-plugin-nestjs-typed";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs", "./prisma/generated/**/*"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  eslintNestJs.configs.flatNoSwagger,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 5,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/imports": "warn"
    }
  },
  {
    plugins: {
      "unused-imports": unusedImports
    },
    rules: {
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": "off"
    }
  },
  {
    rules: {
      "no-shadow": "warn",
      "max-params": ["warn", 4],
      "no-unneeded-ternary": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-namespace": "off"
    }
  }
);
