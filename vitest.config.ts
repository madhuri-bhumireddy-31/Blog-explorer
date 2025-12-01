import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['test/setupTests.ts'], // <<< add this line
    deps: {},
    include: ['test/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),        // points to project root
      "@/app": path.resolve(__dirname, "app"),
    },
  },
});
