import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 2000,
});

// Set up Text Encoder/Decoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock crypto API
const mockCrypto = {
  getRandomValues: (buffer: Uint8Array) => {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  },
  subtle: {
    importKey: jest.fn().mockResolvedValue({ type: 'secret' }),
    deriveKey: jest.fn().mockResolvedValue({ type: 'derived' }),
    encrypt: jest.fn().mockImplementation(async (algorithm, key, data) => {
      // Return the original data encrypted
      return new Uint8Array(data);
    }),
    decrypt: jest.fn().mockImplementation(async (algorithm, key, data) => {
      // Return the original data decrypted
      return data;
    })
  }
};

// Set up window.crypto
Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
  writable: true,
  configurable: true
});

// Mock window if needed
if (typeof window === 'undefined') {
  global.window = {} as any;
}
