import { defineConfig } from '@sc-voice/vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.js'],
    globals: true,
    testTimeout: 30000,
  },
});
