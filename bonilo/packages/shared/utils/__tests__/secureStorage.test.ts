// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { secureStorage } from '../secureStorage';

/**
 * setup.ts replaces window.localStorage with vi.fn() stubs (it is NOT a real
 * Storage instance), so spying on Storage.prototype does not intercept these
 * calls. We instead drive the existing localStorage mocks directly and back
 * them with an in-memory Map so encrypt/decrypt round-trips work.
 */
type Mock = ReturnType<typeof vi.fn>;

const ENCRYPTION_KEY_NAME = 'asgard_encryption_key';

describe('Shared SecureStorage', () => {
    let store: Map<string, string>;
    let setItem: Mock;
    let getItem: Mock;
    let removeItem: Mock;

    beforeEach(() => {
        store = new Map<string, string>();
        // Re-implement the vi.fn() localStorage stubs as a working in-memory store.
        setItem = localStorage.setItem as unknown as Mock;
        getItem = localStorage.getItem as unknown as Mock;
        removeItem = localStorage.removeItem as unknown as Mock;
        setItem.mockImplementation((k: string, v: string) => { store.set(k, String(v)); });
        getItem.mockImplementation((k: string) => (store.has(k) ? store.get(k)! : null));
        removeItem.mockImplementation((k: string) => { store.delete(k); });

        // Reset singleton internal state so init() runs fresh each test.
        (secureStorage as any).initialized = false;
        (secureStorage as any).encryptionKey = null;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Encryption/Decryption', () => {
        it('should encrypt and decrypt data correctly', async () => {
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue({} as CryptoKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.spyOn(crypto.subtle, 'encrypt').mockResolvedValue(new ArrayBuffer(16));
            vi.spyOn(crypto.subtle, 'decrypt').mockImplementation(async () => {
                return new TextEncoder().encode('test-value').buffer;
            });

            await secureStorage.init();
            await secureStorage.setItem('key', 'test-value');
            const retrieved = await secureStorage.getItem('key');

            expect(retrieved).toBe('test-value');
        });

        it('should handle corrupted data gracefully', async () => {
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue({} as CryptoKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.spyOn(crypto.subtle, 'decrypt').mockRejectedValue(new Error('Decryption failed'));

            // Seed a value that will fail to decrypt.
            store.set('secure_corrupted-key', 'corrupted-data');

            await secureStorage.init();
            const result = await secureStorage.getItem('corrupted-key');

            expect(result).toBeNull();
        });
    });

    describe('Key Management', () => {
        it('should generate new key if none exists', async () => {
            const generateKeySpy = vi
                .spyOn(crypto.subtle, 'generateKey')
                .mockResolvedValue({} as CryptoKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));

            await secureStorage.init();

            expect(generateKeySpy).toHaveBeenCalledWith(
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );
        });

        it('should reuse existing key if available', async () => {
            const existingKey = {
                key: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(32)))),
                createdAt: Date.now(),
            };
            store.set(ENCRYPTION_KEY_NAME, JSON.stringify(existingKey));
            const importKeySpy = vi
                .spyOn(crypto.subtle, 'importKey')
                .mockResolvedValue({} as CryptoKey);

            await secureStorage.init();

            expect(importKeySpy).toHaveBeenCalled();
        });
    });

    describe('Storage Operations', () => {
        it('should prefix stored keys with secure_', async () => {
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue({} as CryptoKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.spyOn(crypto.subtle, 'encrypt').mockResolvedValue(new ArrayBuffer(16));

            await secureStorage.init();
            await secureStorage.setItem('my-key', 'my-value');

            expect(setItem).toHaveBeenCalledWith('secure_my-key', expect.any(String));
        });

        it('should remove items with correct prefix', () => {
            secureStorage.removeItem('test-key');
            expect(removeItem).toHaveBeenCalledWith('secure_test-key');
        });
    });
});
