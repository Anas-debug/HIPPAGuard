import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Add to global scope
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock the Web Crypto API
const mockCrypto = {
  getRandomValues: (buffer: Uint8Array) => {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  },
  subtle: {
    importKey: jest.fn().mockResolvedValue('mock-key'),
    deriveKey: jest.fn().mockResolvedValue('mock-derived-key'),
    encrypt: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    decrypt: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
  }
} as unknown as Crypto;

Object.defineProperty(window, 'crypto', {
  value: mockCrypto
});
