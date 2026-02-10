import { describe, it, expect, vi, beforeEach } from 'vitest';
import { secureStorage } from '../secureStorage';

describe('Shared SecureStorage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Encryption/Decryption', () => {
        it('should encrypt and decrypt data correctly', async () => {
            const mockKey = {} as CryptoKey;
            
            // Setup crypto mocks
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.spyOn(crypto.subtle, 'encrypt').mockImplementation(async () => {
                return new ArrayBuffer(16);
            });
            vi.spyOn(crypto.subtle, 'decrypt').mockImplementation(async () => {
                const encoder = new TextEncoder();
                return encoder.encode('test-value').buffer;
            });

            await secureStorage.init();
            await secureStorage.setItem('key', 'test-value');
            const retrieved = await secureStorage.getItem('key');

            expect(retrieved).toBe('test-value');
        });

        it('should handle corrupted data gracefully', async () => {
            const mockKey = {} as CryptoKey;
            
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.spyOn(crypto.subtle, 'decrypt').mockRejectedValue(new Error('Decryption failed'));
            
            vi.mocked(localStorage.getItem).mockReturnValue('corrupted-data');

            await secureStorage.init();
            const result = await secureStorage.getItem('corrupted-key');

            expect(result).toBeNull();
        });
    });

    describe('Key Management', () => {
        it('should generate new key if none exists', async () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            const generateKeySpy = vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue({} as CryptoKey);
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
            vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingKey));
            const importKeySpy = vi.spyOn(crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

            await secureStorage.init();

            expect(importKeySpy).toHaveBeenCalled();
        });
    });

    describe('Storage Operations', () => {
        it('should prefix stored keys with secure_', async () => {
            const mockKey = {} as CryptoKey;
            vi.spyOn(crypto.subtle, 'generateKey').mockResolvedValue(mockKey);
            vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(32));
            vi.spyOn(crypto.subtle, 'encrypt').mockResolvedValue(new ArrayBuffer(16));

            await secureStorage.init();
            await secureStorage.setItem('my-key', 'my-value');

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'secure_my-key',
                expect.any(String)
            );
        });

        it('should remove items with correct prefix', () => {
            secureStorage.removeItem('test-key');
            expect(localStorage.removeItem).toHaveBeenCalledWith('secure_test-key');
        });
    });
});
