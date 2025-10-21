import { vi } from 'vitest'

// Mock Vue DevTools Kit completely to prevent any devtools code from running
vi.mock('@vue/devtools-kit', () => ({
  setupDevToolsPlugin: vi.fn(),
  devtoolsContext: {},
  addTimelineEvent: vi.fn(),
  setupDevtoolsPlugin: vi.fn(),
}))

// Setup localStorage mock immediately when this module loads
const createStorageMock = () => {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length
    },
  }
}

// Apply mocks immediately
const localStorageMock = createStorageMock()
const sessionStorageMock = createStorageMock()

// Override on global
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
  configurable: true,
})

// Override on window if available
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
    configurable: true,
  })

  // Disable Vue DevTools completely
  try {
    Object.defineProperty(window, '__VUE_PROD_DEVTOOLS__', {
      value: false,
      writable: true,
      configurable: true,
    })
  } catch (e) {
    // Already defined, try to set it
    ;(window as any).__VUE_PROD_DEVTOOLS__ = false
  }

  try {
    Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
      value: {
        enabled: false,
        emit: vi.fn(),
        on: vi.fn(),
        once: vi.fn(),
        off: vi.fn(),
        appRecords: [],
      },
      writable: true,
      configurable: true,
    })
  } catch (e) {
    // Already defined, assign directly
    ;(window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__ = {
      enabled: false,
      emit: vi.fn(),
      on: vi.fn(),
      once: vi.fn(),
      off: vi.fn(),
      appRecords: [],
    }
  }
}
