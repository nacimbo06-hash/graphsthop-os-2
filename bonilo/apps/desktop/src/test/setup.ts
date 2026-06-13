import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Monotonic counter so crypto.randomUUID() returns a unique value per call.
let uuidCounter = 0;

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Default to a Tauri-like environment so the stores exercise their SQLite
// (repository) path. The browser/localStorage fallback only engages when
// __TAURI_INTERNALS__ is absent; tests that want the fallback can delete it.
(window as any).__TAURI_INTERNALS__ = {};

// Mock crypto.subtle for secure storage tests
Object.defineProperty(global, 'crypto', {
    value: {
        subtle: {
            generateKey: vi.fn(),
            importKey: vi.fn(),
            exportKey: vi.fn(),
            encrypt: vi.fn(),
            decrypt: vi.fn(),
        },
        getRandomValues: vi.fn((arr: Uint8Array) => arr),
        // Return a UNIQUE id per call. A constant id makes entities collide
        // (e.g. two customers sharing one id), corrupting store-level tests.
        randomUUID: vi.fn(() => {
            uuidCounter += 1;
            const n = uuidCounter.toString(16).padStart(12, '0');
            return `00000000-0000-4000-8000-${n}`;
        }),
    },
});

// Reset mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
});
