import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      globalSetup: './vitest.global-setup.ts',
      setupFiles: ['./src/test-setup.ts'],
      // Run tests in single thread to avoid clone issues
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },
      env: {
        __VUE_PROD_DEVTOOLS__: 'false',
      },
      server: {
        deps: {
          inline: ['@vue', '@vueuse', 'pinia'],
        },
      },
      deps: {
        optimizer: {
          web: {
            exclude: ['@vue/devtools-kit'],
          },
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/main.ts',
          '**/*.spec.ts',
          '**/*.test.ts',
          '**/types/**',
        ],
      },
    },
  })
)
