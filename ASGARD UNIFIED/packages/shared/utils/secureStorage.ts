/**
 * Secure Storage Utilities
 * 
 * Provides encryption/decryption for sensitive data.
 * Uses Web Crypto API for AES-GCM encryption.
 */

const ENCRYPTION_KEY_NAME = 'asgard_encryption_key';

class SecureStorageUtil {
    private encryptionKey: CryptoKey | null = null;
    private initialized = false;

    async init(): Promise<void> {
        if (this.initialized) return;
        this.encryptionKey = await this.getOrCreateEncryptionKey();
        this.initialized = true;
    }

    private async getOrCreateEncryptionKey(): Promise<CryptoKey> {
        const storedKeyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
        
        if (storedKeyData) {
            try {
                const keyData = JSON.parse(storedKeyData);
                const keyBuffer = Uint8Array.from(atob(keyData.key), c => c.charCodeAt(0));
                
                return await crypto.subtle.importKey(
                    'raw',
                    keyBuffer,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt', 'decrypt']
                );
            } catch {
                // Generate new key if import fails
            }
        }

        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        const exportedKey = await crypto.subtle.exportKey('raw', key);
        const keyArray = Array.from(new Uint8Array(exportedKey));
        const keyBase64 = btoa(String.fromCharCode.apply(null, keyArray));
        
        localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify({
            key: keyBase64,
            createdAt: Date.now(),
        }));

        return key;
    }

    private async encrypt(data: string): Promise<string> {
        if (!this.encryptionKey) throw new Error('Not initialized');

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            this.encryptionKey,
            dataBuffer
        );

        const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        encryptedArray.set(iv);
        encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);

        return btoa(String.fromCharCode.apply(null, Array.from(encryptedArray)));
    }

    private async decrypt(encryptedData: string): Promise<string> {
        if (!this.encryptionKey) throw new Error('Not initialized');

        const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const iv = encryptedArray.slice(0, 12);
        const dataBuffer = encryptedArray.slice(12);
        
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            this.encryptionKey,
            dataBuffer
        );

        return new TextDecoder().decode(decryptedBuffer);
    }

    async setItem(key: string, value: string): Promise<void> {
        if (!this.initialized) await this.init();
        const encryptedValue = await this.encrypt(value);
        localStorage.setItem(`secure_${key}`, encryptedValue);
    }

    async getItem(key: string): Promise<string | null> {
        if (!this.initialized) await this.init();
        const encryptedValue = localStorage.getItem(`secure_${key}`);
        if (!encryptedValue) return null;
        
        try {
            return await this.decrypt(encryptedValue);
        } catch {
            this.removeItem(key);
            return null;
        }
    }

    removeItem(key: string): void {
        localStorage.removeItem(`secure_${key}`);
    }
}

export const secureStorage = new SecureStorageUtil();
