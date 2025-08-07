import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global test setup with enhanced mocking
globalThis.ResizeObserver = class MockedResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// Mock window.matchMedia with responsive breakpoints
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => {
    const matchesMap: Record<string, boolean> = {
      '(max-width: 320px)': false,
      '(max-width: 768px)': false,
      '(max-width: 1024px)': false,
      '(min-width: 768px)': true,
      '(min-width: 1024px)': true,
      '(prefers-color-scheme: dark)': false,
      '(prefers-reduced-motion: reduce)': false,
    }
    const matches = matchesMap[query as string] || false
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  }),
})

// Mock localStorage with actual storage behavior
class MockStorage {
  private store: { [key: string]: string } = {}

  getItem = vi.fn((key: string) => {
    return this.store[key] || null
  })

  setItem = vi.fn((key: string, value: string) => {
    this.store[key] = String(value)
  })

  removeItem = vi.fn((key: string) => {
    delete this.store[key]
  })

  clear = vi.fn(() => {
    this.store = {}
  })

  get length() {
    return Object.keys(this.store).length
  }

  key = vi.fn((index: number) => {
    const keys = Object.keys(this.store)
    return keys[index] || null
  })
}

const localStorageMock = new MockStorage()
const sessionStorageMock = new MockStorage()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
})

Object.defineProperty(globalThis, 'sessionStorage', {
  value: sessionStorageMock,
})

// Mock IntersectionObserver for lazy loading and scroll animations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalThis_ = globalThis as any
globalThis_.IntersectionObserver = class MockedIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  root = null
  rootMargin = ''
  thresholds = []
}

// Mock fetch for API testing
globalThis.fetch = vi.fn()

// Mock window.location
Object.defineProperty(globalThis, 'location', {
  value: {
    href: 'http://localhost:3000/',
    pathname: '/',
    search: '',
    hash: '',
    reload: vi.fn(),
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
})

// Mock console for testing log outputs
const originalConsole = globalThis.console
globalThis.console = {
  ...originalConsole,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}

// Setup test utilities
export const createMockEvent = (type: string, properties = {}) => {
  const event = new globalThis.Event(type)
  Object.assign(event, properties)
  return event
}

export const mockViewport = (width: number, height: number) => {
  Object.defineProperty(globalThis, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(globalThis, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Update matchMedia mocks based on viewport
  globalThis.matchMedia = vi.fn().mockImplementation(query => {
    const matchesMap: Record<string, boolean> = {
      '(max-width: 320px)': width <= 320,
      '(max-width: 768px)': width <= 768,
      '(max-width: 1024px)': width <= 1024,
      '(min-width: 768px)': width >= 768,
      '(min-width: 1024px)': width >= 1024,
      '(prefers-color-scheme: dark)': false,
      '(prefers-reduced-motion: reduce)': false,
    }
    const matches = matchesMap[query as string] || false
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
}