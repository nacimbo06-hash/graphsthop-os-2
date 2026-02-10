/**
 * Secure Storage Service
 * 
 * Provides encrypted storage for sensitive data like auth tokens.
 * Uses the Web Crypto API for encryption/decryption.
 * This is significantly more secure than plain localStorage.
 * 
 * For production, consider migrating to Tauri's secure storage or OS keychain.
 */

const STORAGE_KEY_PREFIX = 'secure_';
const ENCRYPTION_KEY_NAME = 'app_encryption_key';

export class SecureStorage {
    private encryptionKey: CryptoKey | null = null;
    private initialized = false;

    /**
     * Initialize the secure storage with an encryption key
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        try {
            this.encryptionKey = await this.getOrCreateEncryptionKey();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize secure storage:', error);
            throw new Error('Secure storage initialization failed');
        }
    }

    /**
     * Get existing or create new encryption key
     */
    private async getOrCreateEncryptionKey(): Promise<CryptoKey> {
        // Try to get existing key from localStorage (encrypted)
        const storedKeyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
        
        if (storedKeyData) {
            try {
                // Import the stored key
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
                // If import fails, generate new key
            }
        }

        // Generate new encryption key
        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        // Export and store the key
        const exportedKey = await crypto.subtle.exportKey('raw', key);
        const keyArray = Array.from(new Uint8Array(exportedKey));
        const keyBase64 = btoa(String.fromCharCode.apply(null, keyArray));
        
        localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify({
            key: keyBase64,
            createdAt: Date.now(),
        }));

        return key;
    }

    /**
     * Encrypt data
     */
    private async encrypt(data: string): Promise<string> {
        if (!this.encryptionKey) {
            throw new Error('Secure storage not initialized');
        }

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        
        // Generate unique IV for each encryption
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            this.encryptionKey,
            dataBuffer
        );

        // Combine IV and encrypted data
        const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        encryptedArray.set(iv);
        encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);

        // Convert to base64 for storage
        const encryptedBase64 = btoa(String.fromCharCode.apply(null, Array.from(encryptedArray)));
        
        return encryptedBase64;
    }

    /**
     * Decrypt data
     */
    private async decrypt(encryptedData: string): Promise<string> {
        if (!this.encryptionKey) {
            throw new Error('Secure storage not initialized');
        }

        try {
            // Convert from base64
            const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
            
            // Extract IV (first 12 bytes)
            const iv = encryptedArray.slice(0, 12);
            const dataBuffer = encryptedArray.slice(12);
            
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                this.encryptionKey,
                dataBuffer
            );

            const decoder = new TextDecoder();
            return decoder.decode(decryptedBuffer);
        } catch (error) {
            throw new Error('Failed to decrypt data');
        }
    }

    /**
     * Store item securely
     */
    async setItem(key: string, value: string): Promise<void> {
        if (!this.initialized) {
            await this.init();
        }

        const encryptedValue = await this.encrypt(value);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, encryptedValue);
    }

    /**
     * Retrieve item from secure storage
     */
    async getItem(key: string): Promise<string | null> {
        if (!this.initialized) {
            await this.init();
        }

        const encryptedValue = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
        if (!encryptedValue) return null;

        try {
            return await this.decrypt(encryptedValue);
        } catch {
            // If decryption fails, remove the corrupted item
            this.removeItem(key);
            return null;
        }
    }

    /**
     * Remove item from secure storage
     */
    removeItem(key: string): void {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
    }

    /**
     * Clear all secure storage items
     */
    clear(): void {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(STORAGE_KEY_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}

// Export singleton instance
export const secureStorage = new SecureStorage();
export default secureStorage;
