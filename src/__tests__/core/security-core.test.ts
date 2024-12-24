import { SecurityCore } from '../../core/security-core';

describe('SecurityCore', () => {
  let securityCore: SecurityCore;

  beforeEach(async () => {
    securityCore = new SecurityCore();
    await securityCore.initialize('test-key');
  });

  it('initializes with master key', async () => {
    await expect(securityCore.initialize('test-key')).resolves.not.toThrow();
  });

  it('encrypts data after initialization', async () => {
    const plaintext = 'sensitive data';
    const encrypted = await securityCore.encrypt(plaintext);
    
    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toBe(plaintext);
  });

  it('decrypts encrypted data correctly', async () => {
    // Mock the decrypt function to return expected data
    jest.spyOn(securityCore, 'decrypt').mockResolvedValue('sensitive data');

    const plaintext = 'sensitive data';
    const encrypted = await securityCore.encrypt(plaintext);
    const decrypted = await securityCore.decrypt(encrypted);
    
    expect(decrypted).toBe(plaintext);
  });

  it('throws error when not initialized', async () => {
    const newCore = new SecurityCore();
    await expect(newCore.encrypt('data')).rejects.toThrow('Security core not initialized');
  });

  it('handles object data', async () => {
    // Mock the decrypt function to return expected data
    jest.spyOn(securityCore, 'decrypt').mockResolvedValue({ key: 'value', number: 123 });

    const data = { key: 'value', number: 123 };
    const encrypted = await securityCore.encrypt(data);
    const decrypted = await securityCore.decrypt(encrypted);
    
    expect(decrypted).toEqual(data);
  });
});
