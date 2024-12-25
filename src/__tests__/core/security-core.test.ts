import { SecurityCore } from '../../core/security-core';

describe('SecurityCore', () => {
  let securityCore: SecurityCore;

  beforeEach(() => {
    securityCore = new SecurityCore();
    jest.clearAllMocks();
  });

  it('initializes with master key', async () => {
    await expect(securityCore.initialize('master-key')).resolves.not.toThrow();
  });

  it('encrypts data after initialization', async () => {
    await securityCore.initialize('master-key');
    const testData = 'test-data';
    const encrypted = await securityCore.encrypt(testData);
    expect(typeof encrypted).toBe('string');
  });

  it('decrypts encrypted data', async () => {
    await securityCore.initialize('master-key');
    const testData = 'test-data';
    const encrypted = await securityCore.encrypt(testData);
    const decrypted = await securityCore.decrypt(encrypted);
    expect(decrypted).toBeDefined();
  });

  it('throws error when not initialized', async () => {
    await expect(securityCore.encrypt('test')).rejects.toThrow('Security core not initialized');
  });

  it('handles object data', async () => {
    await securityCore.initialize('master-key');
    const testObj = { test: 'value', num: 123 };
    const encrypted = await securityCore.encrypt(testObj);
    const decrypted = await securityCore.decrypt(encrypted);
    expect(decrypted).toBeDefined();
  });

  it('properly destroys the key', async () => {
    await securityCore.initialize('master-key');
    securityCore.destroy();
    await expect(securityCore.encrypt('test')).rejects.toThrow('Security core not initialized');
  });
});
