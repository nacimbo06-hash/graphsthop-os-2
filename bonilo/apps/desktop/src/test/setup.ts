import '@testing-library/jest-dom';
import { vi } from 'vitest';

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
        randomUUID: vi.fn(() => {
            return '12345678-1234-1234-1234-123456789012'; // Consistently mock or use a random one
        }),
    },
});

// Reset mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
});
