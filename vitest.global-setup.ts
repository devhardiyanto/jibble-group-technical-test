// Global setup that runs before any tests
export default function setup() {
  // Setup localStorage globally before anything loads
  const storage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  }

  // @ts-ignore - Set on globalThis for all contexts
  globalThis.localStorage = storage
  globalThis.sessionStorage = storage

  console.log('[Vitest] Global setup: localStorage mocked')
}
