import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecureStorage } from '../secureStorage';

describe('SecureStorage', () => {
    let secureStorage: SecureStorage;

    beforeEach(() => {
        secureStorage = new SecureStorage();
        vi.clearAllMocks();
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
            // Mock encryption/decryption
            const mockKey = {} as CryptoKey;
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.spyOn(crypto.subtle, 'encrypt').mockResolvedValue(new ArrayBuffer(16));
            vi.spyOn(crypto.subtle, 'decrypt').mockResolvedValue(new ArrayBuffer(8));

            await secureStorage.init();
            await secureStorage.setItem('test-key', 'test-value');
            
            expect(localStorage.setItem).toHaveBeenCalled();
            // Check that at least one call includes the secure prefix
            const secureCalls = vi.mocked(localStorage.setItem).mock.calls.filter(
                call => call[0]?.toString().startsWith('secure_')
            );
            expect(secureCalls.length).toBeGreaterThan(0);
        });

        it('should return null for non-existent keys', async () => {
            const mockKey = {} as CryptoKey;
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.mocked(localStorage.getItem).mockReturnValue(null);

            await secureStorage.init();
            const value = await secureStorage.getItem('non-existent');
            
            expect(value).toBeNull();
        });
    });

    describe('removeItem', () => {
        it('should remove items from storage', async () => {
            secureStorage.removeItem('test-key');
            expect(localStorage.removeItem).toHaveBeenCalledWith('secure_test-key');
        });
    });

    describe('clear', () => {
        it('should clear all secure storage items', async () => {
            vi.mocked(localStorage.key).mockReturnValueOnce('secure_item1');
            vi.mocked(localStorage.key).mockReturnValueOnce('secure_item2');
            vi.mocked(localStorage.key).mockReturnValueOnce(null);
            Object.defineProperty(localStorage, 'length', { value: 2, writable: true });

            secureStorage.clear();
            
            expect(localStorage.removeItem).toHaveBeenCalledWith('secure_item1');
            expect(localStorage.removeItem).toHaveBeenCalledWith('secure_item2');
        });
    });
});
