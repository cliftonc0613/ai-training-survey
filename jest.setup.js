import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream } from 'web-streams-polyfill'

// Polyfill for Next.js Edge Runtime APIs
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream

// Polyfill Request and Response for Next.js API routes
if (typeof global.Request === 'undefined') {
  global.Request = class Request {}
}
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    static json(data, init) {
      return {
        status: init?.status || 200,
        headers: new Map(),
        json: async () => data,
      }
    }
  }
}
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}
