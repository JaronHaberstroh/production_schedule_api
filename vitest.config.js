import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    clearMocks: true,
    globals: true,
    coverage: {
      provider: "v8",
    },
    setupFiles: ["dotenv/config"],
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    environmentMatchGlobs: [
      ["src/**/*unit.test.js", "vi/vitest-environment-unit"],
      ["src/**/*integration.test.js", "vi/vitest-environment-integration"],
    ],
  },
});
