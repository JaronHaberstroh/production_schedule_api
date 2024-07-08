import globals from "globals";
import pluginJs from "@eslint/js";
import vitest from "eslint-plugin-vitest";

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.test.js"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
        mockReq: true,
        mockRes: true,
        mockNext: true,
      },
    },
  },
];
