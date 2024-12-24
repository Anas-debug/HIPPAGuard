// Types for our security implementation
type EncryptedData = string;
type PlainData = string | object;

interface SecurityConfig {
    encryptionAlgorithm: 'AES-256-GCM';
    ivLength: number;
    saltLength: number;
    iterations: number;
}

/**
 * Core encryption class that handles all cryptographic operations
 */
export class SecurityCore {
    private readonly config: SecurityConfig;
    private key: CryptoKey | null = null;

    constructor(config?: Partial<SecurityConfig>) {
        this.config = {
            encryptionAlgorithm: 'AES-256-GCM',
            ivLength: 12,       // 96 bits for GCM
            saltLength: 16,     // 128 bits
            iterations: 100000, // PBKDF2 iterations
            ...config
        };
    }

    /**
     * Initialize the security core with a master key
     */
    async initialize(masterKey: string): Promise<void> {
        try {
            // Convert the master key to a crypto key using PBKDF2
            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(masterKey),
                'PBKDF2',
                false,
                ['deriveKey']
            );

            // Generate a unique salt
            const salt = crypto.getRandomValues(new Uint8Array(this.config.saltLength));

            // Derive the actual encryption key
            this.key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt,
                    iterations: this.config.iterations,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
        } catch (error) {
            throw new Error('Failed to initialize security core: ' + error);
        }
    }

    /**
     * Encrypt data with authenticated encryption
     */
    async encrypt(data: PlainData): Promise<EncryptedData> {
        if (!this.key) {
            throw new Error('Security core not initialized');
        }

        try {
            // Generate a new IV for each encryption
            const iv = crypto.getRandomValues(new Uint8Array(this.config.ivLength));
            const encoder = new TextEncoder();
            
            // Convert data to string if it's an object
            const plaintext = typeof data === 'string' ? data : JSON.stringify(data);

            // Encrypt the data
            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv
                },
                this.key,
                encoder.encode(plaintext)
            );

            // Combine IV and encrypted data
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encryptedData), iv.length);

            // Return as base64
            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            throw new Error('Encryption failed: ' + error);
        }
    }

    /**
     * Decrypt data with authentication check
     */
    async decrypt(encryptedData: EncryptedData): Promise<PlainData> {
        if (!this.key) {
            throw new Error('Security core not initialized');
        }

        try {
            // Convert from base64
            const combined = new Uint8Array(
                atob(encryptedData).split('').map(c => c.charCodeAt(0))
            );

            // Extract IV and encrypted data
            const iv = combined.slice(0, this.config.ivLength);
            const data = combined.slice(this.config.ivLength);

            // Decrypt
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv
                },
                this.key,
                data
            );

            // Convert back to string
            const decoder = new TextDecoder();
            const plaintext = decoder.decode(decrypted);

            // Try to parse as JSON, return as string if not valid JSON
            try {
                return JSON.parse(plaintext);
            } catch {
                return plaintext;
            }
        } catch (error) {
            throw new Error('Decryption failed - data may be corrupted or tampered with');
        }
    }

    /**
     * Clear sensitive data from memory
     */
    destroy(): void {
        this.key = null;
    }
}

// Export default configuration
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
    encryptionAlgorithm: 'AES-256-GCM',
    ivLength: 12,
    saltLength: 16,
    iterations: 100000
};