// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecureStorage } from '../secureStorage';

describe('SecureStorage', () => {
    let secureStorage: SecureStorage;

    beforeEach(() => {
        secureStorage = new SecureStorage();
        // localStorage is already mocked by setup.ts (vi.fn() stubs)
        // vi.clearAllMocks() in setup.ts resets all calls
    });

    describe('init', () => {
        it('should initialize successfully', async () => {
            const mockKey = {} as CryptoKey;
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));

            await secureStorage.init();
            expect(secureStorage).toBeDefined();
        });
    });

    describe('setItem and getItem', () => {
        it('should store and retrieve items securely', async () => {
            const mockKey = {} as CryptoKey;
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            // encrypt returns a realistic buffer so btoa() produces a non-empty string
            vi.spyOn(crypto.subtle, 'encrypt').mockResolvedValue(new ArrayBuffer(16));

            await secureStorage.init();
            await secureStorage.setItem('test-key', 'test-value');

            // Verify localStorage.setItem was called with the prefixed key
            const setItemMock = localStorage.setItem as unknown as ReturnType<typeof vi.fn>;
            const secureCalls = setItemMock.mock.calls.filter(
                (call: any[]) => call[0]?.toString().startsWith('secure_')
            );
            expect(secureCalls.length).toBeGreaterThan(0);
            expect(secureCalls[0][0]).toBe('secure_test-key');
        });

        it('should return null for non-existent keys', async () => {
            const mockKey = {} as CryptoKey;
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            // getItem already returns null by default (setup.ts default)

            await secureStorage.init();
            const value = await secureStorage.getItem('non-existent');

            expect(value).toBeNull();
        });
    });

    describe('removeItem', () => {
        it('should remove items from storage', () => {
            secureStorage.removeItem('test-key');

            const removeItemMock = localStorage.removeItem as unknown as ReturnType<typeof vi.fn>;
            expect(removeItemMock).toHaveBeenCalledWith('secure_test-key');
        });
    });

    describe('clear', () => {
        it('should clear all secure storage items', () => {
            // Mock localStorage.length and .key() to simulate 3 items
            const mockStorage = localStorage as any;
            Object.defineProperty(mockStorage, 'length', { value: 3, writable: true, configurable: true });

            let callCount = 0;
            const keys = ['secure_item1', 'secure_item2', 'normal_item'];
            mockStorage.key.mockImplementation((i: number) => keys[i] ?? null);

            secureStorage.clear();

            const removeItemMock = localStorage.removeItem as unknown as ReturnType<typeof vi.fn>;
            // Should only remove the secure_ prefixed items
            expect(removeItemMock).toHaveBeenCalledWith('secure_item1');
            expect(removeItemMock).toHaveBeenCalledWith('secure_item2');
            expect(removeItemMock).not.toHaveBeenCalledWith('normal_item');
        });
    });
});
